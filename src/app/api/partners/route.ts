import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, findMany, create, findById, update, deleteById } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');

    let whereClause = '';
    let params: any[] = [];

    if (category) {
      whereClause = 'category = ?';
      params.push(category);
    }

    if (active !== null) {
      const activeCondition = active === 'true' ? 'active = 1' : 'active = 0';
      whereClause = whereClause ? `${whereClause} AND ${activeCondition}` : activeCondition;
    }

    const partners = await executeQuery(`
      SELECT * FROM partners 
      ${whereClause ? `WHERE ${whereClause}` : ''} 
      ORDER BY \`order\` ASC, name ASC
    `, params);

    return NextResponse.json({ partners });

  } catch (error) {
    console.error('Erreur lors de la récupération des partenaires:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des partenaires' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, logoUrl, websiteUrl, category, active = true, order = 0 } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Les champs nom et catégorie sont obligatoires' },
        { status: 400 }
      );
    }

    const partnerData = {
      id: `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description?.trim() || null,
      logoUrl: logoUrl || null,
      websiteUrl: websiteUrl || null,
      category,
      active: active ? 1 : 0,
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await create('partners', partnerData);

    return NextResponse.json(
      { message: 'Partenaire créé avec succès', partner: partnerData },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur lors de la création du partenaire:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du partenaire' },
      { status: 500 }
    );
  }
}
