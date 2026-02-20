import type { Router } from 'express';
import { Router as createRouter } from 'express';
import { z } from 'zod';
import { getSupabaseAdmin } from '../lib/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const contactCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export function contactsRouter(): Router {
  const router = createRouter();

  router.post('/contacts', async (req, res) => {
    const parsed = contactCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('contacts').insert({
      name: parsed.data.name.trim(),
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone?.trim() ?? null,
      subject: parsed.data.subject.trim(),
      message: parsed.data.message.trim(),
      status: 'NEW',
    });
    if (error) return res.status(500).json({ error: 'Database error' });

    return res.status(201).json({ ok: true });
  });

  router.get('/admin/contacts', requireAuth, requireAdmin, async (_req, res) => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: 'Database error' });
    return res.json({ contacts: data ?? [] });
  });

  return router;
}
