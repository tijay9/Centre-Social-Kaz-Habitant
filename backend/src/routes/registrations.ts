import type { Router } from 'express';
import { Router as createRouter } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { getSupabaseAdmin } from '../lib/supabase';
import { getEnv } from '../lib/env';
import { requireAuth, requireAdmin } from '../middleware/auth';
import {
  sendBrevoEmail,
  sendAdminEmail,
  getAdminNotificationEmail,
  getFinalConfirmationEmail,
  getUserConfirmationEmail,
} from '../lib/brevo';

const createSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  message: z.string().optional().nullable(),
  event_id: z.coerce.number().int().positive(),
});

const adminPatchSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED']),
});

type RegistrationRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string | null;
  status: 'PENDING' | 'EMAIL_CONFIRMED' | 'CONFIRMED' | 'CANCELLED';
  event_id: number;
  email_token: string | null;
  email_token_expiry: string | null;
  email_confirmed_at: string | null;
  admin_approved_at: string | null;
  admin_approved_by: number | null;
  created_at: string;
  updated_at: string;
};

type EventRow = {
  id: number;
  title: string;
  date: string;
  time: string | null;
  location: string;
  description: string;
};

export function registrationsRouter(): Router {
  const router = createRouter();

  // Create registration + send email confirmation
  router.post('/registrations', async (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const supabase = getSupabaseAdmin();
    const env = getEnv();

    const email = parsed.data.email.toLowerCase().trim();

    const { data: event, error: eventErr } = await supabase
      .from('events')
      .select('id,title,date,time,location,description')
      .eq('id', parsed.data.event_id)
      .maybeSingle();

    if (eventErr) return res.status(500).json({ error: 'Database error' });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Prevent duplicates (except cancelled)
    const { data: existing, error: existingErr } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', parsed.data.event_id)
      .eq('email', email)
      .neq('status', 'CANCELLED');

    if (existingErr) return res.status(500).json({ error: 'Database error' });
    if ((existing ?? []).length > 0) return res.status(409).json({ error: 'Already registered' });

    const email_token = crypto.randomBytes(32).toString('hex');
    const email_token_expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const id = `reg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    const { error: insertErr } = await supabase.from('registrations').insert({
      id,
      first_name: parsed.data.first_name.trim(),
      last_name: parsed.data.last_name.trim(),
      email,
      phone: parsed.data.phone.trim(),
      message: parsed.data.message?.trim() ?? null,
      status: 'PENDING',
      event_id: parsed.data.event_id,
      email_token,
      email_token_expiry,
    });

    if (insertErr) return res.status(500).json({ error: 'Database error' });

    const userName = `${parsed.data.first_name.trim()} ${parsed.data.last_name.trim()}`;
    const eventDate = new Date((event as EventRow).date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const confirmationLink = `${env.BACKEND_URL.replace(/\/+$/, '')}/registrations/confirm-email?token=${email_token}`;

    const emailContent = getUserConfirmationEmail(
      userName,
      (event as EventRow).title,
      eventDate,
      (event as EventRow).location,
      confirmationLink
    );

    await sendBrevoEmail({
      to: email,
      toName: userName,
      subject: emailContent.subject,
      htmlContent: emailContent.htmlContent,
      textContent: emailContent.textContent,
    });

    return res.status(201).json({
      message: 'Inscription créée. Veuillez confirmer votre email.',
      registration: { id, email, status: 'PENDING' },
    });
  });

  // Confirm email token
  router.get('/registrations/confirm-email', async (req, res) => {
    const token = String(req.query.token ?? '');
    if (!token) return res.redirect(`${getEnv().FRONTEND_URL}/evenements?error=token_invalide`);

    const supabase = getSupabaseAdmin();
    const env = getEnv();

    const { data: reg, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('email_token', token)
      .maybeSingle();

    if (error) return res.redirect(`${env.FRONTEND_URL}/evenements?error=erreur_serveur`);
    if (!reg) return res.redirect(`${env.FRONTEND_URL}/evenements?error=token_invalide`);

    const registration = reg as RegistrationRow;

    if (!registration.email_token_expiry || new Date() > new Date(registration.email_token_expiry)) {
      return res.redirect(`${env.FRONTEND_URL}/evenements?error=token_expire`);
    }

    if (registration.status === 'EMAIL_CONFIRMED' || registration.status === 'CONFIRMED') {
      return res.redirect(`${env.FRONTEND_URL}/evenements?success=deja_confirme`);
    }

    const { error: updateErr } = await supabase
      .from('registrations')
      .update({
        status: 'EMAIL_CONFIRMED',
        email_confirmed_at: new Date().toISOString(),
        email_token: null,
        email_token_expiry: null,
      })
      .eq('id', registration.id);

    if (updateErr) return res.redirect(`${env.FRONTEND_URL}/evenements?error=erreur_serveur`);

    const { data: event, error: eventErr } = await supabase
      .from('events')
      .select('id,title,date,location')
      .eq('id', registration.event_id)
      .maybeSingle();

    if (eventErr || !event) return res.redirect(`${env.FRONTEND_URL}/evenements?error=evenement_introuvable`);

    const userName = `${registration.first_name} ${registration.last_name}`;
    const eventDate = new Date((event as any).date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const approvalLink = `${env.FRONTEND_URL.replace(/\/+$/, '')}/admin/registrations`;
    const adminEmailContent = getAdminNotificationEmail(
      userName,
      registration.email,
      registration.phone,
      (event as any).title,
      eventDate,
      approvalLink,
      registration.id
    );

    await sendAdminEmail({
      subject: adminEmailContent.subject,
      htmlContent: adminEmailContent.htmlContent,
      textContent: adminEmailContent.textContent,
    });

    return res.redirect(`${env.FRONTEND_URL}/evenements?success=email_confirme&event=${(event as any).id}`);
  });

  // Admin list
  router.get('/admin/registrations', requireAuth, requireAdmin, async (req, res) => {
    const supabase = getSupabaseAdmin();

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('registrations')
      .select('*, events(title,date,location)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) return res.status(500).json({ error: 'Database error' });

    return res.json({
      registrations: data ?? [],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    });
  });

  // Admin approve/reject
  router.patch('/admin/registrations/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = String(req.params.id);
    const parsed = adminPatchSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const supabase = getSupabaseAdmin();

    const { data: reg, error } = await supabase.from('registrations').select('*').eq('id', id).maybeSingle();
    if (error) return res.status(500).json({ error: 'Database error' });
    if (!reg) return res.status(404).json({ error: 'Not found' });

    const registration = reg as RegistrationRow;

    const { error: patchErr } = await supabase
      .from('registrations')
      .update({
        status: parsed.data.status,
        admin_approved_at: parsed.data.status === 'CONFIRMED' ? new Date().toISOString() : null,
        admin_approved_by: parsed.data.status === 'CONFIRMED' ? (req as any).user?.id ?? null : null,
      })
      .eq('id', id);

    if (patchErr) return res.status(500).json({ error: 'Database error' });

    if (parsed.data.status === 'CONFIRMED') {
      const { data: event, error: eventErr } = await supabase
        .from('events')
        .select('id,title,date,time,location,description')
        .eq('id', registration.event_id)
        .maybeSingle();

      if (!eventErr && event) {
        const userName = `${registration.first_name} ${registration.last_name}`;
        const eventDate = new Date((event as EventRow).date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        const content = getFinalConfirmationEmail(
          userName,
          (event as EventRow).title,
          eventDate,
          (event as EventRow).time,
          (event as EventRow).location,
          (event as EventRow).description
        );

        await sendBrevoEmail({
          to: registration.email,
          toName: userName,
          subject: content.subject,
          htmlContent: content.htmlContent,
          textContent: content.textContent,
        });
      }
    }

    return res.json({ ok: true });
  });

  return router;
}
