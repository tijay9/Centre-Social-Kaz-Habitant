import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hasPermission } from '@/lib/auth';
import { create, findMany } from '@/lib/database';

// Types
export type GalleryCategory = 'seniors' | 'reeap' | 'laep' | 'jeunesse' | 'general';

interface GalleryImageRow {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  filename: string | null;
  category: GalleryCategory;
  tags?: string[] | string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  uploadedAt: string | Date;
  uploadedById: string | null;
}

interface ApiGalleryImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  category: GalleryCategory;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Données mockées pour la galerie (utile en dev) - DÉSACTIVÉ
const mockGalleryImages: ApiGalleryImage[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');

    // Construire dynamiquement le WHERE et les paramètres
    const whereParts: string[] = [];
    const params: unknown[] = [];

    if (category && category.trim().length > 0) {
      whereParts.push('category = ?');
      params.push(category.toUpperCase().replace('-', '_'));
    }

    if (q && q.trim().length > 0) {
      const like = `%{q.toLowerCase()}%`;
      // On recherche dans title, description et tags (si stockés en texte/JSON)
      whereParts.push('(LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(tags) LIKE ?)');
      params.push(like, like, like);
    }

    const where = whereParts.length > 0 ? whereParts.join(' AND ') : undefined;

    // Récupération depuis la base - ORDER BY uploadedAt DESC
    const rows = await findMany<GalleryImageRow>('gallery_images', where, params, 'ORDER BY uploadedAt DESC');

    // Si aucune donnée en base, retourner un tableau vide
    if (!rows || rows.length === 0) {
      return NextResponse.json([]);
    }

    // Normalisation du format
    const normalized: ApiGalleryImage[] = rows.map((r) => ({
      id: r.id,
      url: r.url,
      title: r.title ?? undefined,
      description: r.description ?? undefined,
      category: r.category,
      tags: (() => {
        try {
          if (Array.isArray(r.tags)) return r.tags as string[];
          if (typeof r.tags === 'string') return JSON.parse(r.tags) as string[];
        } catch {
          // ignore
        }
        return [] as string[];
      })(),
      createdAt: (typeof r.uploadedAt === 'string' ? new Date(r.uploadedAt) : r.uploadedAt).toISOString(),
      updatedAt: (typeof r.uploadedAt === 'string' ? new Date(r.uploadedAt) : r.uploadedAt).toISOString()
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Erreur API gallery:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des images' },
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
    const { url, title, description, category } = body as Partial<ApiGalleryImage> & { category?: string };

    if (!url) {
      return NextResponse.json(
        { error: 'L\'URL de l\'image est obligatoire' },
        { status: 400 }
      );
    }

    // Catégories valides incluant les nouvelles
    const allowed = ['seniors', 'reeap', 'laep', 'jeunesse', 'anime-quartier', 'acces-droits', 'general'];
    const normalizedCategory = category ? String(category).toLowerCase().replace('_', '-') : 'general';
    const finalCategory = allowed.includes(normalizedCategory) ? normalizedCategory : 'general';

    // Générer un ID unique
    const id = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Extraire le nom du fichier depuis l'URL ou générer un nom
    let filename = 'image.jpg';
    try {
      const urlPath = new URL(url.trim()).pathname;
      const parts = urlPath.split('/');
      filename = parts[parts.length - 1] || `${id}.jpg`;
    } catch {
      // Si l'URL n'est pas valide, utiliser l'ID comme nom de fichier
      filename = `${id}.jpg`;
    }
    
    // Utiliser un objet Date pour MySQL
    const now = new Date();

    const imageData = {
      id,
      url: url.trim(),
      title: title?.toString().trim() || null,
      description: description?.toString().trim() || null,
      filename: filename, // Nom de fichier généré ou extrait de l'URL
      category: finalCategory.toUpperCase().replace('-', '_'), // Convertir en format ENUM MySQL
      tags: JSON.stringify([]),
      size: 0, // Valeur par défaut pour éviter l'erreur NOT NULL
      width: 0, // Valeur par défaut pour éviter l'erreur NOT NULL
      height: 0, // Valeur par défaut pour éviter l'erreur NOT NULL
      uploadedAt: now,
      uploadedById: user.id
    };

    await create('gallery_images', imageData as unknown as Record<string, unknown>);

    const apiImage: ApiGalleryImage = {
      id,
      url: imageData.url,
      title: imageData.title ?? undefined,
      description: imageData.description ?? undefined,
      category: normalizedCategory as GalleryCategory,
      tags: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    return NextResponse.json(
      { message: 'Image ajoutée avec succès', image: apiImage },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'image:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de l\'image' },
      { status: 500 }
    );
  }
}

// Ajout suppression d'une image (ADMIN)
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const idFromQuery = searchParams.get('id');

    let id = idFromQuery ?? null;
    if (!id) {
      try {
        const body = await request.json();
        id = body?.id ?? null;
      } catch {
        // ignore body parse errors; we'll validate below
      }
    }

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: "Paramètre 'id' manquant" }, { status: 400 });
    }

    // Import here to avoid tree-shaking issues in environments
    const { deleteById } = await import('@/lib/database');
    await deleteById('gallery_images', id);

    return NextResponse.json({ message: 'Image supprimée avec succès', id });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'image" },
      { status: 500 }
    );
  }
}