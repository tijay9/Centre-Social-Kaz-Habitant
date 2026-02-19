import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, findMany, findById, create, update, deleteById } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Récupérer un membre spécifique
      const member = await findById('team_members', id);
      if (!member) {
        return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 });
      }

      // Transformer les données pour le frontend
      const formattedMember = {
        id: member.id,
        name: member.name,
        role: member.position, // Map 'position' from database to 'role' for frontend
        category: typeof member.category === 'string'
          ? member.category.toLowerCase()
          : String(member.category ?? '').toLowerCase(),
        bio: member.bio || '',
        image: member.imageUrl,
        email: member.email,
        phone: member.phone,
        location: '', // Le champ location n'existe pas dans la base de données
        isActive: Boolean(member.active),
        joinedAt:
          member && (member as any).createdAt
            ? new Date((member as any).createdAt as string | number | Date).toISOString()
            : new Date().toISOString()
      };

      return NextResponse.json(formattedMember);
    } else {
      // Récupérer tous les membres de l'équipe depuis la base de données
      const teamMembers = await executeQuery('SELECT * FROM team_members ORDER BY `order` ASC, createdAt DESC');

      // Transformer les données pour le frontend
      const formattedMembers = teamMembers.map((member: any) => ({
        id: member.id,
        name: member.name,
        role: member.position, // Map 'position' from database to 'role' for frontend
        category: typeof member.category === 'string'
          ? member.category.toLowerCase()
          : String(member.category ?? '').toLowerCase(),
        description: member.bio || '', // Utiliser bio comme description pour la compatibilité
        image: member.imageUrl,
        email: member.email,
        phone: member.phone,
        isActive: Boolean(member.active),
        joinedAt:
          member && member.createdAt
            ? new Date(member.createdAt as string | number | Date).toISOString()
            : new Date().toISOString(),
        createdAt: member.createdAt,
        updatedAt: member.updatedAt
      }));

      return NextResponse.json({
        teamMembers: formattedMembers,
        success: true
      });
    }
  } catch (error) {
    console.error('Erreur API team:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'équipe', teamMembers: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== TEAM CREATION START ===');

    const user = await requireAuth(request);
    console.log('Auth user:', user);

    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    if (!hasPermission(user.role, ['ADMIN', 'MODERATOR'])) {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });
    }

    const body = await request.json();
    console.log('Request body:', body);

    if (!body.name || !body.role || !body.category) {
      return NextResponse.json(
        { error: 'Les champs nom, rôle et catégorie sont obligatoires' },
        { status: 400 },
      );
    }

    const memberData = {
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      position: body.role,
      category: String(body.category).toUpperCase(),
      bio: body.bio || '',
      imageUrl: body.imageUrl || null,
      email: body.email || null,
      phone: body.phone || null,
      active: body.isActive !== undefined ? body.isActive : true,
      order: body.order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await create('team_members', memberData);

    return NextResponse.json({
      message: "Membre d'équipe créé avec succès",
      member: memberData,
    });
  } catch (error) {
    console.error('Erreur lors de la création du membre:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Erreur serveur: ${message}` },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN', 'MODERATOR'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID du membre requis' }, { status: 400 });
    }

    const existingMember = await findById('team_members', id);
    if (!existingMember) {
      return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 });
    }

    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (updateData.name !== undefined) updateFields.name = updateData.name;
    if (updateData.role !== undefined) updateFields.position = updateData.role;
    if (updateData.category !== undefined)
      updateFields.category = String(updateData.category).toUpperCase();
    if (updateData.bio !== undefined) updateFields.bio = updateData.bio;
    if (updateData.imageUrl !== undefined) updateFields.imageUrl = updateData.imageUrl;
    if (updateData.email !== undefined) updateFields.email = updateData.email;
    if (updateData.phone !== undefined) updateFields.phone = updateData.phone;
    if (updateData.isActive !== undefined) updateFields.active = updateData.isActive;
    if (updateData.order !== undefined) updateFields.order = updateData.order;

    await update('team_members', id, updateFields);

    return NextResponse.json({
      message: "Membre d'équipe mis à jour avec succès",
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du membre:', error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du membre" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN', 'MODERATOR'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID du membre requis' }, { status: 400 });
    }

    const existingMember = await findById('team_members', id);
    if (!existingMember) {
      return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 });
    }

    await deleteById('team_members', id);

    return NextResponse.json({
      message: "Membre d'équipe supprimé avec succès",
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du membre" },
      { status: 500 },
    );
  }
}