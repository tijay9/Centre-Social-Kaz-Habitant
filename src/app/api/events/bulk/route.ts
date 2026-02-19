import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';

// POST - Actions en masse sur les événements
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN', 'MODERATOR'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { action, eventIds, data } = body;

    if (!action || !Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json(
        { error: 'Action et IDs d\'événements sont requis' },
        { status: 400 }
      );
    }

    const placeholders = eventIds.map(() => '?').join(', ');

    switch (action) {
      case 'publish':
        await executeQuery(
          `UPDATE events SET status = 'PUBLISHED', updatedAt = ? WHERE id IN (${placeholders})`,
          [new Date(), ...eventIds]
        );
        break;

      case 'draft':
        await executeQuery(
          `UPDATE events SET status = 'DRAFT', updatedAt = ? WHERE id IN (${placeholders})`,
          [new Date(), ...eventIds]
        );
        break;

      case 'cancel':
        await executeQuery(
          `UPDATE events SET status = 'CANCELLED', updatedAt = ? WHERE id IN (${placeholders})`,
          [new Date(), ...eventIds]
        );
        break;

      case 'delete':
        // Supprimer d'abord les inscriptions associées
        await executeQuery(
          `DELETE FROM registrations WHERE eventId IN (${placeholders})`,
          eventIds
        );
        // Puis supprimer les événements
        await executeQuery(
          `DELETE FROM events WHERE id IN (${placeholders})`,
          eventIds
        );
        break;

      case 'update_category':
        if (!data?.category) {
          return NextResponse.json(
            { error: 'Catégorie requise pour cette action' },
            { status: 400 }
          );
        }
        await executeQuery(
          `UPDATE events SET category = ?, updatedAt = ? WHERE id IN (${placeholders})`,
          [data.category, new Date(), ...eventIds]
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      message: `Action "${action}" appliquée à ${eventIds.length} événement(s)` 
    });

  } catch (error) {
    console.error('Erreur lors de l\'action en masse:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'action en masse' },
      { status: 500 }
    );
  }
}