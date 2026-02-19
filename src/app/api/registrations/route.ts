import { NextRequest, NextResponse } from 'next/server';
import { db, executeQuery, findMany, create, findById } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';
import { sendBrevoEmail, getUserConfirmationEmail } from '@/lib/brevo-email';
import crypto from 'crypto';

// GET - Récupérer toutes les inscriptions
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN', 'MODERATOR'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let whereClause = '';
    const params: any[] = [];

    if (eventId) {
      whereClause = 'eventId = ?';
      params.push(eventId);
    }

    if (status) {
      whereClause = whereClause ? `${whereClause} AND r.status = ?` : 'r.status = ?';
      params.push(status);
    }

    if (search) {
      const searchCondition = '(firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)';
      whereClause = whereClause ? `${whereClause} AND ${searchCondition}` : searchCondition;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const offset = (page - 1) * limit;

    // Récupérer les inscriptions avec les informations de l'événement
    const registrations = await executeQuery(`
      SELECT r.*, e.title as eventTitle, e.date as eventDate, e.location as eventLocation
      FROM registrations r
      LEFT JOIN events e ON r.eventId = e.id
      ${whereClause ? `WHERE ${whereClause}` : ''}
      ORDER BY r.createdAt DESC
      LIMIT ${limit} OFFSET ${offset}
    `, params);

    // Compter le total
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM registrations r 
      LEFT JOIN events e ON r.eventId = e.id
    `;
    if (whereClause) {
      countQuery += ` WHERE ${whereClause}`;
    }

    const [countResult] = await db.execute(countQuery, params);
    const total = Array.isArray(countResult) ? (countResult[0] as any).total : 0;

    return NextResponse.json({
      registrations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des inscriptions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des inscriptions' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle inscription avec validation email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message, eventId } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !eventId) {
      return NextResponse.json(
        { error: 'Les champs prénom, nom, email, téléphone et ID événement sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier que l'événement existe et récupérer ses détails
    const event = await findById('events', eventId) as any;
    if (!event) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur n'est pas déjà inscrit
    const existingRegistration = await executeQuery(
      'SELECT * FROM registrations WHERE eventId = ? AND email = ? AND status != ?',
      [eventId, email.trim().toLowerCase(), 'CANCELLED']
    );

    if (Array.isArray(existingRegistration) && existingRegistration.length > 0) {
      return NextResponse.json(
        { error: 'Vous êtes déjà inscrit(e) à cet événement' },
        { status: 409 }
      );
    }

    // Générer un token de validation unique
    const emailToken = crypto.randomBytes(32).toString('hex');
    const emailTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    const registrationData = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message?.trim() || null,
      status: 'PENDING',
      eventId,
      emailToken,
      emailTokenExpiry,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await create('registrations', registrationData);

    // Préparer les données pour l'email
    const userName = `${firstName} ${lastName}`;
    const eventDate = new Date(event.date as string).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const eventLocation = event.location as string;
    
    // Créer le lien de confirmation
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const confirmationLink = `${baseUrl}/api/registrations/confirm-email?token=${emailToken}`;

    // Préparer l'email de confirmation
    const emailContent = getUserConfirmationEmail(
      userName,
      event.title as string,
      eventDate,
      eventLocation,
      confirmationLink
    );

    // Envoyer l'email de confirmation à l'utilisateur
    const emailSent = await sendBrevoEmail({
      to: email.trim().toLowerCase(),
      toName: userName,
      subject: emailContent.subject,
      htmlContent: emailContent.htmlContent,
      textContent: emailContent.textContent
    });

    if (!emailSent) {
      console.error('⚠️ Email de confirmation non envoyé, mais inscription créée');
    }

    return NextResponse.json(
      { 
        message: 'Inscription créée avec succès. Veuillez vérifier votre email pour confirmer votre inscription.',
        registration: {
          id: registrationData.id,
          email: registrationData.email,
          status: registrationData.status
        }
      },
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