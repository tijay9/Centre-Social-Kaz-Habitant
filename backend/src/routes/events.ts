import type { Router } from 'express';
import { Router as createRouter } from 'express';
import { z } from 'zod';
import { getSupabaseAdmin } from '../lib/supabase';
import { requireAuth, requireAdmin, type AuthedRequest } from '../middleware/auth';

const eventInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().optional().default(''),
  date: z.string().min(1),
  time: z.string().optional().nullable(),
  location: z.string().min(1),
  image_url: z.string().optional().nullable(),
  category: z.enum(['SENIORS', 'REEAP', 'LAEP', 'JEUNESSE', 'ACCES_DROITS', 'ANIME_QUARTIER', 'GENERAL']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED']).optional().default('DRAFT'),
  featured: z.boolean().optional().default(false),
  max_participants: z.number().int().positive().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
});

type EventRow = {
  id: number;
  title: string;
  description: string;
  content: string | null;
  date: string;
  time: string | null;
  location: string;
  image_url: string | null;
  category: string;
  status: string;
  featured: boolean;
  max_participants: number | null;
  tags: string | null;
  created_by_id: number | null;
  created_at: string;
  updated_at: string;
};

function normalizeTags(tags: EventRow['tags']): string[] {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function eventsRouter(): Router {
  const router = createRouter();

  // Public
  router.get('/events', async (req, res) => {
    const supabase = getSupabaseAdmin();

    const status = String(req.query.status ?? 'PUBLISHED').toUpperCase();
    const category = req.query.category ? String(req.query.category).toUpperCase() : undefined;

    let query = supabase.from('events').select('*').order('date', { ascending: false });
    if (status) query = query.eq('status', status);
    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: 'Database error' });

    const events = (data as EventRow[]).map((e) => {
      const tags = normalizeTags(e.tags);
      // Normalize for frontend
      return {
        ...e,
        tags,
        imageUrl: e.image_url,
      } as any;
    });

    // Compat: keep {events} but also allow clients expecting an array
    // (some frontend code calls apiFetch<any[]>('/events'))
    if (req.headers.accept?.includes('application/json') && String(req.query.format ?? '') === 'array') {
      return res.json(events);
    }

    return res.json({ events });
  });

  router.get('/events/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
    if (error) return res.status(500).json({ error: 'Database error' });
    if (!data) return res.status(404).json({ error: 'Not found' });

    const event = data as EventRow;
    return res.json({ event: { ...event, tags: normalizeTags(event.tags) } });
  });

  // Admin
  router.post('/admin/events', requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const parsed = eventInputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const input = parsed.data;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('events')
      .insert({
        title: input.title.trim(),
        description: input.description.trim(),
        content: input.content?.trim() ?? null,
        date: input.date,
        time: input.time ?? null,
        location: input.location.trim(),
        image_url: input.image_url ?? null,
        category: input.category,
        status: input.status,
        featured: input.featured,
        max_participants: input.max_participants ?? null,
        tags: JSON.stringify(input.tags ?? []),
        created_by_id: req.user?.id ?? null,
      })
      .select('*')
      .single();

    if (error) return res.status(500).json({ error: 'Database error' });

    const event = data as EventRow;
    return res.status(201).json({ event: { ...event, tags: normalizeTags(event.tags) } });
  });

  router.put('/admin/events/:id', requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const parsed = eventInputSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const input = parsed.data;
    const supabase = getSupabaseAdmin();

    const patch: Record<string, unknown> = { ...input };
    if (Array.isArray(input.tags)) patch.tags = JSON.stringify(input.tags);

    const { data, error } = await supabase.from('events').update(patch).eq('id', id).select('*').maybeSingle();
    if (error) return res.status(500).json({ error: 'Database error' });
    if (!data) return res.status(404).json({ error: 'Not found' });

    const event = data as EventRow;
    return res.json({ event: { ...event, tags: normalizeTags(event.tags) } });
  });

  router.delete('/admin/events/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Database error' });

    return res.json({ ok: true });
  });

  return router;
}
