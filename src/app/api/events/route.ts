import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hasPermission } from '@/lib/auth';
import { create, findMany, executeQuery } from '@/lib/database';
import { Event as AppEvent } from '@/types';

// Type représentant une ligne d'événement telle que retournée par la DB
// (tags pouvant être une string JSON et certains champs en string ou Date)
type DBEventRow = {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string | Date;
  time: string | null;
  location: string;
  imageUrl?: string | null;
  category: string;
  status: string;
  featured?: boolean | number;
  maxParticipants?: number | null;
  tags?: string | string[] | null;
  createdById: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export async function GET() {
  try {
    const rows = await executeQuery('SELECT * FROM events ORDER BY date DESC');

    const events = (rows as DBEventRow[]).map((row) => {
      // Correction : formatage de la date sans conversion de fuseau horaire
      let formattedDate: string;
      if (typeof row.date === 'string') {
        // Si c'est déjà une string, on prend juste les 10 premiers caractères
        formattedDate = row.date.substring(0, 10);
      } else {
        // Si c'est un objet Date, utiliser toLocaleDateString pour éviter les décalages
        formattedDate = new Date(row.date).toLocaleDateString('en-CA'); // Format YYYY-MM-DD
      }

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        content: row.content,
        date: formattedDate,
        time: row.time,
        location: row.location,
        imageUrl: row.imageUrl ?? null,
        category: row.category,
        status: row.status,
        featured: !!row.featured,
        maxParticipants: row.maxParticipants ?? null,
        tags: Array.isArray(row.tags)
          ? row.tags
          : row.tags
          ? JSON.parse(String(row.tags))
          : [],
        createdById: row.createdById,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth || !hasPermission(auth.role, ['ADMIN', 'MODERATOR', 'EDITOR'])) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      imageUrl,
      status = 'DRAFT',
      tags = [],
      featured = false,
      maxParticipants
    } = body;

    // Validation des données requises
    if (!title || !description || !date || !location || !category) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    // Validation de la catégorie
    const validCategories = ['SENIORS', 'REEAP', 'LAEP', 'JEUNESSE', 'ANIME_QUARTIER', 'ACCES_DROITS'];
    if (!validCategories.includes(String(category).toUpperCase())) {
      return NextResponse.json(
        { error: 'Catégorie invalide' },
        { status: 400 }
      );
    }

    // Validation du statut
    const validStatuses = ['DRAFT', 'PUBLISHED', 'CANCELLED'];
    if (!validStatuses.includes(String(status).toUpperCase())) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Générer un ID unique
    const id = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Préparer les données pour l'insertion
    const eventData = {
      id,
      title: String(title).trim(),
      description: String(description).trim(),
      content: String(description).trim(), // Pour l'instant, content = description
      // on garde la date telle qu’envoyée (string YYYY-MM-DD) pour éviter les problèmes de fuseau
      date: String(date),
      time: time || null,
      location: String(location).trim(),
      imageUrl: imageUrl || null,
      category: String(category).toUpperCase(),
      status: String(status).toUpperCase(),
      featured: Boolean(featured),
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
      tags: JSON.stringify(tags), // Stocker les tags en JSON
      createdById: auth.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insérer dans la base de données
    await create('events', eventData);

    return NextResponse.json({
      success: true,
      event: {
        ...eventData,
        tags // Retourner les tags non-stringifiés
      },
      message: 'Événement créé avec succès'
    });

  } catch (error) {
    console.error('Erreur création événement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'événement' },
      { status: 500 }
    );
  }
}