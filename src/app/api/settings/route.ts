import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, findMany, create, update } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';

// GET - Récupérer tous les paramètres
export async function GET(request: NextRequest) {
  try {
    const settings = await findMany('settings');
    
    const settingsObject = (settings as any[]).reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.value,
        type: setting.type
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({ settings: settingsObject });

  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour des paramètres
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Paramètres invalides' },
        { status: 400 }
      );
    }

    // Mise à jour ou création de chaque paramètre
    for (const [key, data] of Object.entries(settings)) {
      const { value, type } = data as any;
      
      // Vérifier si le paramètre existe déjà
      const [existingSetting] = await executeQuery(
        'SELECT * FROM settings WHERE `key` = ?',
        [key]
      ) as any[];

      if (existingSetting) {
        await executeQuery(
          'UPDATE settings SET value = ?, type = ?, updatedAt = ? WHERE `key` = ?',
          [value, type || 'TEXT', new Date(), key]
        );
      } else {
        await create('settings', {
          id: `setting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          key,
          value,
          type: type || 'TEXT',
          updatedAt: new Date()
        });
      }
    }

    return NextResponse.json({ message: 'Paramètres mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un paramètre spécifique
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { key, value, type } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Clé et valeur sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier si le paramètre existe
    const [existingSetting] = await executeQuery(
      'SELECT * FROM settings WHERE `key` = ?',
      [key]
    ) as any[];

    if (existingSetting) {
      await executeQuery(
        'UPDATE settings SET value = ?, type = ?, updatedAt = ? WHERE `key` = ?',
        [value, type || existingSetting.type, new Date(), key]
      );
    } else {
      await create('settings', {
        id: `setting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        key,
        value,
        type: type || 'TEXT',
        updatedAt: new Date()
      });
    }

    return NextResponse.json({ message: 'Paramètre mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du paramètre:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du paramètre' },
      { status: 500 }
    );
  }
}
