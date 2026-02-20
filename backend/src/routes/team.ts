import type { Router } from 'express';
import { Router as createRouter } from 'express';
import { z } from 'zod';
import { getSupabaseAdmin } from '../lib/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const teamSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  category: z.enum(['SENIORS', 'REEAP', 'LAEP', 'JEUNESSE', 'GENERAL']),
  bio: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  active: z.boolean().optional().default(true),
  sort_order: z.number().int().optional().default(0),
});

export function teamRouter(): Router {
  const router = createRouter();

  router.get('/team', async (req, res) => {
    const supabase = getSupabaseAdmin();
    const id = req.query.id ? Number(req.query.id) : undefined;

    if (id && Number.isFinite(id)) {
      const { data, error } = await supabase.from('team_members').select('*').eq('id', id).maybeSingle();
      if (error) return res.status(500).json({ error: 'Database error' });
      if (!data) return res.status(404).json({ error: 'Not found' });
      return res.json({ member: data });
    }

    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: 'Database error' });
    return res.json({ teamMembers: data ?? [] });
  });

  router.post('/admin/team', requireAuth, requireAdmin, async (req, res) => {
    const parsed = teamSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('team_members').insert(parsed.data).select('*').single();
    if (error) return res.status(500).json({ error: 'Database error' });

    return res.status(201).json({ member: data });
  });

  router.put('/admin/team/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const parsed = teamSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('team_members').update(parsed.data).eq('id', id).select('*').maybeSingle();
    if (error) return res.status(500).json({ error: 'Database error' });
    if (!data) return res.status(404).json({ error: 'Not found' });

    return res.json({ member: data });
  });

  router.delete('/admin/team/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Database error' });

    return res.json({ ok: true });
  });

  return router;
}
