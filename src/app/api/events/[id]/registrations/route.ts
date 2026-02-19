import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, findMany, create, findById } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';

// GET - Récupérer les inscriptions d'un événement spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN', 'MODERATOR'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id: eventId } = await params;

    // Vérifier que l'événement existe
    const event = await findById('events', eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    const registrations = await findMany('registrations', 'eventId = ?', [eventId]);

    return NextResponse.json({ registrations });

  } catch (error) {
    console.error('Erreur lors de la récupération des inscriptions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des inscriptions' },
      { status: 500 }
    );
  }
}

// POST - Créer une inscription pour un événement spécifique
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const body = await request.json();
    const { firstName, lastName, email, phone, message } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Les champs prénom, nom, email et téléphone sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier que l'événement existe
    const event = await findById('events', eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur n'est pas déjà inscrit
    const existingRegistration = await executeQuery(
      'SELECT * FROM registrations WHERE eventId = ? AND email = ?',
      [eventId, email.trim().toLowerCase()]
    );

    if (Array.isArray(existingRegistration) && existingRegistration.length > 0) {
      return NextResponse.json(
        { error: 'Vous êtes déjà inscrit(e) à cet événement' },
        { status: 409 }
      );
    }

    const registrationData = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message?.trim() || null,
      status: 'PENDING',
      eventId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await create('registrations', registrationData);

    return NextResponse.json(
      { message: 'Inscription créée avec succès', registration: registrationData },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur lors de la création de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'inscription' },
      { status: 500 }
    );
  }
}