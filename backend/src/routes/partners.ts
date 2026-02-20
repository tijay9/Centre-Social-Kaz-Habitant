import type { Router } from 'express';
import { Router as createRouter } from 'express';
import { z } from 'zod';
import { getSupabaseAdmin } from '../lib/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const partnerSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  logo_url: z.string().optional().nullable(),
  website_url: z.string().optional().nullable(),
  category: z.enum(['INSTITUTIONAL', 'ASSOCIATIF', 'PRIVE']),
  active: z.boolean().optional().default(true),
  sort_order: z.number().int().optional().default(0),
});

export function partnersRouter(): Router {
  const router = createRouter();

  router.get('/partners', async (_req, res) => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: 'Database error' });
    return res.json({ partners: data ?? [] });
  });

  router.post('/admin/partners', requireAuth, requireAdmin, async (req, res) => {
    const parsed = partnerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('partners').insert(parsed.data).select('*').single();
    if (error) return res.status(500).json({ error: 'Database error' });

    return res.status(201).json({ partner: data });
  });

  router.put('/admin/partners/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const parsed = partnerSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('partners').update(parsed.data).eq('id', id).select('*').maybeSingle();
    if (error) return res.status(500).json({ error: 'Database error' });
    if (!data) return res.status(404).json({ error: 'Not found' });

    return res.json({ partner: data });
  });

  router.delete('/admin/partners/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Database error' });

    return res.json({ ok: true });
  });

  return router;
}
