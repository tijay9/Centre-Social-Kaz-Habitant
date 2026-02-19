import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, create } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';

type SqlParams = (string | number | null)[];

// GET - Récupérer toutes les inscriptions aux événements
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let whereClause = '';
    let params: SqlParams = [];

    if (status) {
      whereClause = 'r.status = ?';
      params.push(status);
    }

    if (category) {
      const categoryCondition = 'e.category = ?';
      whereClause = whereClause ? `${whereClause} AND ${categoryCondition}` : categoryCondition;
      params.push(category);
    }

    if (search) {
      const searchCondition =
        '(r.firstName LIKE ? OR r.lastName LIKE ? OR r.email LIKE ? OR e.title LIKE ?)';
      whereClause = whereClause ? `${whereClause} AND ${searchCondition}` : searchCondition;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    const offset = (page - 1) * limit;

    // Récupérer les inscriptions avec les informations des événements
    const registrations = await executeQuery(
      `
      SELECT 
        r.*,
        e.title as eventTitle,
        e.date as eventDate,
        e.location as eventLocation,
        e.category as eventCategory
      FROM registrations r
      LEFT JOIN events e ON r.eventId = e.id
      ${whereClause ? `WHERE ${whereClause}` : ''}
      ORDER BY r.createdAt DESC
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset]
    );

    // Compter le total
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM registrations r 
      LEFT JOIN events e ON r.eventId = e.id
    `;
    if (whereClause) {
      countQuery += ` WHERE ${whereClause}`;
    }

    const countRows = (await executeQuery<any>(countQuery, params)) as any[];
    const total = Array.isArray(countRows) && countRows.length > 0 ? countRows[0].total : 0;

    // Statistiques des inscriptions
    const statusRows = (await executeQuery<any>(
      `
      SELECT 
        status,
        COUNT(*) as count
      FROM registrations r
      LEFT JOIN events e ON r.eventId = e.id
      ${whereClause ? `WHERE ${whereClause}` : ''}
      GROUP BY status
    `,
      params
    )) as any[];

    return NextResponse.json({
      registrations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        byStatus: Array.isArray(statusRows) ? statusRows : [],
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des inscriptions:', error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des inscriptions" },
      { status: 500 }
    );
  }
}

// POST - Créer une inscription directement (admin)
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, message, eventId, status = 'CONFIRMED' } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !eventId) {
      return NextResponse.json(
        { error: "Les champs prénom, nom, email, téléphone et ID événement sont obligatoires" },
        { status: 400 }
      );
    }

    // Vérifier que l'événement existe
    const events = (await executeQuery<any>('SELECT * FROM events WHERE id = ?', [eventId])) as any[];
    const event = events[0];
    if (!event) {
      return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
    }

    // Vérifier si l'utilisateur n'est pas déjà inscrit
    const existing = (await executeQuery<any>(
      'SELECT * FROM registrations WHERE eventId = ? AND email = ?',
      [eventId, email.trim().toLowerCase()]
    )) as any[];
    const existingRegistration = existing[0];

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Une inscription existe déjà pour cet email sur cet événement' },
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
      status,
      eventId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await create('registrations', registrationData);

    return NextResponse.json(
      { message: "Inscription créée avec succès", registration: registrationData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'inscription" },
      { status: 500 }
    );
  }
}