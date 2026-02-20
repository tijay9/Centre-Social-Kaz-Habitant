import type { Router } from 'express';
import { Router as createRouter } from 'express';
import { z } from 'zod';
import { getSupabaseAdmin } from '../lib/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional().nullable(),
  category: z.enum(['SENIORS', 'REEAP', 'LAEP', 'JEUNESSE', 'ACCES_DROITS', 'ANIME_QUARTIER', 'GENERAL']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional().default('DRAFT'),
  image_url: z.string().optional().nullable(),
  featured: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
});

export function postsRouter(): Router {
  const router = createRouter();

  router.get('/posts', async (req, res) => {
    const supabase = getSupabaseAdmin();
    const status = String(req.query.status ?? 'PUBLISHED').toUpperCase();
    const { data, error } = await supabase.from('posts').select('*').eq('status', status).order('published_at', { ascending: false });
    if (error) return res.status(500).json({ error: 'Database error' });
    return res.json({ posts: data ?? [] });
  });

  router.post('/admin/posts', requireAuth, requireAdmin, async (req, res) => {
    const parsed = postSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('posts')
      .insert({
        ...parsed.data,
        tags: JSON.stringify(parsed.data.tags ?? []),
        published_at: parsed.data.status === 'PUBLISHED' ? new Date().toISOString() : null,
      })
      .select('*')
      .single();
    if (error) return res.status(500).json({ error: 'Database error' });

    return res.status(201).json({ post: data });
  });

  router.put('/admin/posts/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const parsed = postSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const patch: Record<string, unknown> = { ...parsed.data };
    if (Array.isArray(parsed.data.tags)) patch.tags = JSON.stringify(parsed.data.tags);
    if (parsed.data.status === 'PUBLISHED') patch.published_at = new Date().toISOString();

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('posts').update(patch).eq('id', id).select('*').maybeSingle();
    if (error) return res.status(500).json({ error: 'Database error' });
    if (!data) return res.status(404).json({ error: 'Not found' });

    return res.json({ post: data });
  });

  router.delete('/admin/posts/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Database error' });

    return res.json({ ok: true });
  });

  return router;
}
