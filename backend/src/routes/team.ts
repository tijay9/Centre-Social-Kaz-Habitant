import type { Router } from 'express';
import { Router as createRouter } from 'express';
import { z } from 'zod';
import { getSupabaseAdmin } from '../lib/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const teamBaseSchema = z.object({
  name: z.string().min(1),
  // accepte l'ancien champ role (UI admin) et le map sur position
  position: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  category: z.enum(['SENIORS', 'REEAP', 'LAEP', 'JEUNESSE', 'GENERAL']),
  bio: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  active: z.boolean().optional().default(true),
  sort_order: z.number().int().optional().default(0),
});

const teamSchema = teamBaseSchema.transform((v) => ({
  ...v,
  position: (v.position ?? v.role ?? '').trim(),
}));

const teamPatchSchema = teamBaseSchema.partial().transform((v) => ({
  ...v,
  position: typeof v.position === 'string' || typeof v.role === 'string' ? (v.position ?? v.role ?? '').trim() : undefined,
}));

const categoryMap: Record<string, string> = {
  seniors: 'SENIORS',
  reeap: 'REEAP',
  laep: 'LAEP',
  jeunesse: 'JEUNESSE',
  direction: 'GENERAL',
  general: 'GENERAL',
  acces_droits: 'ACCES_DROITS',
  anime_quartier: 'ANIME_QUARTIER',
};

const adminTeamSchema = z
  .object({
    name: z.string().min(1),
    role: z.string().min(1),
    category: z.string().min(1),
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
    isActive: z.boolean().optional().default(true),
    order: z.number().int().optional().default(0),
  })
  .transform((v) => ({
    name: v.name.trim(),
    position: v.role.trim(),
    category: categoryMap[v.category] ?? v.category.toUpperCase(),
    bio: v.bio ?? null,
    image_url: v.imageUrl ?? null,
    email: v.email ?? null,
    phone: v.phone ?? null,
    active: v.isActive ?? true,
    sort_order: v.order ?? 0,
  }));

const adminTeamPatchSchema = z
  .object({
    name: z.string().min(1).optional(),
    role: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    order: z.number().int().optional(),
  })
  .transform((v) => {
    const out: Record<string, unknown> = {};
    if (typeof v.name === 'string') out.name = v.name.trim();
    if (typeof v.role === 'string') out.position = v.role.trim();
    if (typeof v.category === 'string') out.category = categoryMap[v.category] ?? v.category.toUpperCase();
    if (v.bio !== undefined) out.bio = v.bio;
    if (v.imageUrl !== undefined) out.image_url = v.imageUrl;
    if (v.email !== undefined) out.email = v.email;
    if (v.phone !== undefined) out.phone = v.phone;
    if (v.isActive !== undefined) out.active = v.isActive;
    if (v.order !== undefined) out.sort_order = v.order;
    return out;
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

  router.get('/admin/team', requireAuth, requireAdmin, async (req, res) => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true });
    if (error) return res.status(500).json({ error: 'Database error' });

    const members = (data ?? []).map((m: any) => ({
      id: String(m.id),
      name: m.name,
      role: m.position,
      category: String(m.category ?? 'GENERAL').toLowerCase(),
      email: m.email ?? undefined,
      phone: m.phone ?? undefined,
      location: undefined,
      image: m.image_url ?? undefined,
      bio: m.bio ?? '',
      isActive: Boolean(m.active),
      joinedAt: m.created_at,
    }));

    return res.json(members);
  });

  router.post('/admin/team', requireAuth, requireAdmin, async (req, res) => {
    const parsed = adminTeamSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('team_members').insert(parsed.data).select('*').single();
    if (error) return res.status(500).json({ error: 'Database error' });

    return res.status(201).json({ member: data });
  });

  router.put('/admin/team/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });

    const parsed = adminTeamPatchSchema.safeParse(req.body);
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
