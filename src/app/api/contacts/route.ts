import { NextRequest, NextResponse } from 'next/server';
import { db, create } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';
import { CONTACT_STATUSES, PAGINATION_CONFIG, REGEX, LIMITS } from '@/lib/config';
import { sendEmail, emailTemplates } from '@/lib/email';
import { sendBrevoEmail } from '@/lib/brevo-email';

interface CountRow { total: number }

// GET - Récupérer les contacts avec pagination (admin uniquement)
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    const rawLimit = parseInt(searchParams.get('limit') || `${PAGINATION_CONFIG.contacts.pageSize}`, 10);
    const status = searchParams.get('status');

    const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);
    const limit = Math.min(
      Math.max(1, isNaN(rawLimit) ? PAGINATION_CONFIG.contacts.pageSize : rawLimit),
      PAGINATION_CONFIG.contacts.maxPageSize
    );
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params: unknown[] = [];

    if (status) {
      whereClause = 'status = ?';
      params.push(status);
    }

    // Requête de données avec tri et pagination
    let dataQuery = 'SELECT * FROM contacts';
    if (whereClause) dataQuery += ` WHERE ${whereClause}`;
    dataQuery += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';

    const dataParams = [...params, limit, offset];
    const [rows] = await db.execute(dataQuery, dataParams);

    // Requête de comptage total
    let countQuery = 'SELECT COUNT(*) as total FROM contacts';
    if (whereClause) countQuery += ` WHERE ${whereClause}`;
    const [countRows] = await db.execute(countQuery, params);
    const total = (countRows as CountRow[])[0]?.total || 0;

    return NextResponse.json({
      contacts: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des contacts' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau contact (formulaire public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body.name || '').toString().trim();
    const email = (body.email || '').toString().trim().toLowerCase();
    const phone = (body.phone || '').toString().trim();
    const subject = (body.subject || '').toString().trim();
    const message = (body.message || '').toString().trim();

    const errors: Record<string, string> = {};

    if (name.length < LIMITS.CONTACT.NAME_MIN || name.length > LIMITS.CONTACT.NAME_MAX) {
      errors.name = `Le nom doit contenir entre ${LIMITS.CONTACT.NAME_MIN} et ${LIMITS.CONTACT.NAME_MAX} caractères`;
    }
    if (!REGEX.EMAIL.test(email)) {
      errors.email = "Format d'email invalide";
    }
    if (subject.length < LIMITS.CONTACT.SUBJECT_MIN || subject.length > LIMITS.CONTACT.SUBJECT_MAX) {
      errors.subject = `Le sujet doit contenir entre ${LIMITS.CONTACT.SUBJECT_MIN} et ${LIMITS.CONTACT.SUBJECT_MAX} caractères`;
    }
    if (message.length < LIMITS.CONTACT.MESSAGE_MIN || message.length > LIMITS.CONTACT.MESSAGE_MAX) {
      errors.message = `Le message doit contenir entre ${LIMITS.CONTACT.MESSAGE_MIN} et ${LIMITS.CONTACT.MESSAGE_MAX} caractères`;
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation échouée', fieldErrors: errors }, { status: 400 });
    }

    const htmlContent = `
      <h2>Nouveau message de contact - Centre Social Dorothy</h2>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</p>
      <p><strong>Sujet :</strong> ${subject}</p>
      <p><strong>Message :</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    const textContent = `Nouveau message de contact - Centre Social Dorothy\n\n` +
      `Nom : ${name}\n` +
      `Email : ${email}\n` +
      `Téléphone : ${phone || 'Non renseigné'}\n` +
      `Sujet : ${subject}\n\n` +
      `Message :\n${message}`;

    const ok = await sendBrevoEmail({
      to: process.env.ADMIN_EMAIL || 'emailjehaneruam@gmail.com',
      toName: 'Administrateur Dorothy',
      subject: `Contact site Dorothy - ${subject}`,
      htmlContent,
      textContent,
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Impossible d'envoyer le message pour le moment. Veuillez réessayer plus tard." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Message envoyé avec succès.' }, { status: 200 });
  } catch (error) {
    console.error('[Contact] Erreur serveur:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}