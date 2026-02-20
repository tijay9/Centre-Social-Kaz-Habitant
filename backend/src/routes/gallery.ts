import type { Router } from 'express';
import { Router as createRouter } from 'express';
import { z } from 'zod';
import { getSupabaseAdmin } from '../lib/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const gallerySchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  filename: z.string().optional().nullable(),
  url: z.string().min(1),
  category: z
    .enum(['SENIORS', 'REEAP', 'LAEP', 'JEUNESSE', 'ANIME_QUARTIER', 'ACCES_DROITS', 'GENERAL'])
    .optional()
    .nullable(),
  tags: z.array(z.string()).optional().default([]),
  size: z.number().int().optional().nullable(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
});

export function galleryRouter(): Router {
  const router = createRouter();

  router.get('/gallery', async (req, res) => {
    const supabase = getSupabaseAdmin();

    const category = req.query.category ? String(req.query.category).toUpperCase() : undefined;

    let query = supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: 'Database error' });

    return res.json(data ?? []);
  });

  router.post('/admin/gallery', requireAuth, requireAdmin, async (req, res) => {
    const parsed = gallerySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        ...parsed.data,
        tags: JSON.stringify(parsed.data.tags ?? []),
      })
      .select('*')
      .single();

    if (error) return res.status(500).json({ error: 'Database error' });
    return res.status(201).json({ image: data });
  });

  router.put('/admin/gallery/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const parsed = gallerySchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const patch: Record<string, unknown> = { ...parsed.data };
    if (Array.isArray(parsed.data.tags)) patch.tags = JSON.stringify(parsed.data.tags);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('gallery_images').update(patch).eq('id', id).select('*').maybeSingle();
    if (error) return res.status(500).json({ error: 'Database error' });
    if (!data) return res.status(404).json({ error: 'Not found' });

    return res.json({ image: data });
  });

  router.delete('/admin/gallery/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Database error' });

    return res.json({ ok: true });
  });

  return router;
}
