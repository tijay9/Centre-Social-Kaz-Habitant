import type { Router } from 'express';
import { Router as createRouter } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getSupabaseAdmin } from '../lib/supabase';
import { signJwt, verifyJwt } from '../lib/jwt';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional().default('Admin'),
});

export function authRouter(): Router {
  const router = createRouter();

  router.post('/auth/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const { email, password } = parsed.data;
    const supabase = getSupabaseAdmin();

    const { data: user, error } = await supabase
      .from('users')
      .select('id,email,password_hash,name,role,active')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) return res.status(500).json({ error: 'Database error' });
    if (!user || !user.active) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signJwt({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  });

  router.get('/auth/me', async (req, res) => {
    const header = req.header('authorization');
    const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
      const user = verifyJwt(token);
      return res.json({ user });
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  });

  // Temporaire: création d'un admin via API
  router.post('/auth/register-admin', async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const { email, password, name } = parsed.data;
    const supabase = getSupabaseAdmin();

    const password_hash = await bcrypt.hash(password, 12);

    const { data, error } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash,
        name,
        role: 'ADMIN',
        active: true,
      })
      .select('id,email,name,role,active')
      .single();

    if (error) {
      // unique violation etc
      return res.status(400).json({ error: 'Unable to create admin' });
    }

    const token = signJwt({
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
    });

    return res.status(201).json({ user: data, token });
  });

  return router;
}
