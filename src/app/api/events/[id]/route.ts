import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, findById, update, deleteById } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';

// GET - Récupérer un événement spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    
    const event = await findById('events', eventId);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les informations du créateur
    const eventQueryResult = await executeQuery(`
      SELECT e.*, u.name as createdByName 
      FROM events e 
      LEFT JOIN users u ON e.createdById = u.id 
      WHERE e.id = ?
    `, [eventId]);
    
    const eventWithCreator = Array.isArray(eventQueryResult) ? eventQueryResult[0] : eventQueryResult;

    return NextResponse.json({ 
      event: {
        ...eventWithCreator,
        tags: eventWithCreator && 'tags' in eventWithCreator && eventWithCreator.tags ? JSON.parse(eventWithCreator.tags) : []
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'événement' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un événement spécifique
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN', 'MODERATOR'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id: eventId } = await params;
    const body = await request.json();

    // Si on met cet événement "À la une", on désactive "À la une" pour tous les autres
    if (body.featured === true) {
      try {
        await executeQuery('UPDATE events SET featured = 0 WHERE id != ?', [eventId]);
      } catch (err) {
        console.error("Erreur lors de la réinitialisation des événements à la une:", err);
      }
    }

    const existingEvent = await findById('events', eventId);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    const updateData = {
      ...body,
      tags: body.tags ? JSON.stringify(body.tags) : null,
      updatedAt: new Date()
    };

    // Supprimer les valeurs undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    await update('events', eventId, updateData);

    return NextResponse.json({ message: 'Événement mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'événement' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un événement spécifique
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN', 'MODERATOR'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id: eventId } = await params;

    const existingEvent = await findById('events', eventId);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    await deleteById('events', eventId);

    return NextResponse.json({ message: 'Événement supprimé avec succès' });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'événement' },
      { status: 500 }
    );
  }
}