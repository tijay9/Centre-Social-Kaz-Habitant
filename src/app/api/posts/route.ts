import { NextRequest, NextResponse } from 'next/server';
import { db, executeQuery } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const search = searchParams.get('search');

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (category && category !== 'all') {
      whereClause += ' AND p.category = ?';
      params.push(category.toUpperCase());
    }
    
    if (status && status !== 'all') {
      whereClause += ' AND p.status = ?';
      params.push(status.toUpperCase());
    }
    
    if (featured === 'true') {
      whereClause += ' AND p.featured = 1';
    }

    if (search) {
      whereClause += ' AND (p.title LIKE ? OR p.content LIKE ? OR p.excerpt LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const pageSize = limit ? parseInt(limit) : 10;
    const currentPage = page ? parseInt(page) : 1;
    const offset = (currentPage - 1) * pageSize;

    // Requête pour les posts
    const postsQuery = `
      SELECT 
        p.id, p.title, p.content, p.excerpt, p.category, p.status,
        p.imageUrl, p.featured, p.tags, p.createdAt, p.updatedAt,
        p.publishedAt, p.authorId,
        u.name as authorName, u.email as authorEmail
      FROM posts p
      LEFT JOIN users u ON p.authorId = u.id
      ${whereClause}
      ORDER BY p.featured DESC, p.createdAt DESC
      LIMIT ? OFFSET ?
    `;

    // Requête pour le count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM posts p
      ${whereClause}
    `;

    const [posts, countResult] = await Promise.all([
      db.execute(postsQuery, [...params, pageSize, offset]),
      db.execute(countQuery, params)
    ]);

    const totalCount = (countResult as any[])[0].total;

    const formattedPosts = (posts as any[]).map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      author: {
        name: post.authorName,
        email: post.authorEmail
      }
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        total: totalCount,
        page: currentPage,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    });

  } catch (error) {
    console.error('Erreur récupération articles:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Début création article ===');
    
    const auth = requireAuth(request);
    if (!auth || !hasPermission(auth.role, ['ADMIN', 'MODERATOR', 'EDITOR'])) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const {
      title,
      content,
      excerpt,
      category,
      status,
      imageUrl,
      featured,
      tags
    } = data;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Titre, contenu et catégorie requis' },
        { status: 400 }
      );
    }

    // Validation des enums
    const validCategories = ['SENIORS', 'REEAP', 'LAEP', 'JEUNESSE', 'ACCES_DROITS', 'ANIME_QUARTIER', 'GENERAL'];
    const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
    
    const upperCategory = category.toUpperCase();
    const upperStatus = status ? status.toUpperCase() : 'DRAFT';
    
    if (!validCategories.includes(upperCategory)) {
      return NextResponse.json(
        { error: `Catégorie invalide. Valeurs acceptées: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    if (status && !validStatuses.includes(upperStatus)) {
      return NextResponse.json(
        { error: `Status invalide. Valeurs acceptées: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const postId = db.generateId();
    const now = new Date();
    const publishedAt = upperStatus === 'PUBLISHED' ? now : null;
    
    const insertQuery = `
      INSERT INTO posts (
        id, title, content, excerpt, category, status, imageUrl, 
        featured, tags, createdAt, updatedAt, publishedAt, authorId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      postId,
      title,
      content,
      excerpt || null,
      upperCategory,
      upperStatus,
      imageUrl || null,
      featured ? 1 : 0,
      tags && tags.length > 0 ? JSON.stringify(tags) : null,
      now,
      now,
      publishedAt,
      auth.id
    ];

    await db.execute(insertQuery, params);

    // Récupérer le post créé avec les infos de l'auteur
    const selectQuery = `
      SELECT 
        p.*, u.name as authorName, u.email as authorEmail
      FROM posts p
      LEFT JOIN users u ON p.authorId = u.id
      WHERE p.id = ?
    `;

    const [createdPost] = await db.execute(selectQuery, [postId]) as any[];

    const responseData = {
      ...createdPost,
      tags: createdPost.tags ? JSON.parse(createdPost.tags) : [],
      author: {
        name: createdPost.authorName,
        email: createdPost.authorEmail
      }
    };

    console.log('Article créé:', responseData);

    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    console.error('=== Erreur création article ===');
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error message:', message);
    console.error('Full error:', error);
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création', details: message },
      { status: 500 }
    );
  }
}
