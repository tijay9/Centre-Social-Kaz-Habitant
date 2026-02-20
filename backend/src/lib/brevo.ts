import { getEnv } from './env';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export interface EmailParams {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendBrevoEmail(params: EmailParams): Promise<boolean> {
  const env = getEnv();

  const senderEmail = env.BREVO_SENDER_EMAIL;
  if (!senderEmail) {
    console.error('[Brevo] Missing BREVO_SENDER_EMAIL (must be a verified sender in Brevo)');
    return false;
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Centre Social Dorothy',
          email: senderEmail,
        },
        to: [
          {
            email: params.to,
            name: params.toName || params.to,
          },
        ],
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent,
      }),
    });

    const text = await response.text();
    if (!response.ok) {
      console.error('[Brevo] API error', response.status, text);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Brevo] send error', err);
    return false;
  }
}

export async function sendAdminEmail(params: Omit<EmailParams, 'to' | 'toName'>): Promise<boolean> {
  const env = getEnv();
  return sendBrevoEmail({
    to: env.ADMIN_EMAIL,
    toName: 'Administrateur Dorothy',
    ...params,
  });
}

export function getUserConfirmationEmail(
  userName: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  confirmationLink: string
) {
  return {
    subject: `Confirmez votre inscription - ${eventTitle}`,
    htmlContent: `<!DOCTYPE html><html><body style="font-family: Arial, sans-serif;">
      <h2>Bonjour ${userName},</h2>
      <p>Merci pour votre demande d'inscription. Pour finaliser votre inscription, veuillez confirmer votre adresse email :</p>
      <p><a href="${confirmationLink}">Confirmer mon inscription</a></p>
      <hr />
      <p><strong>Événement :</strong> ${eventTitle}<br/>
      <strong>Date :</strong> ${eventDate}<br/>
      <strong>Lieu :</strong> ${eventLocation}</p>
      <p style="color:#777">Ce lien expirera dans 24 heures.</p>
    </body></html>`,
    textContent: `Bonjour ${userName},\n\nConfirmez votre inscription : ${confirmationLink}\n\nÉvénement: ${eventTitle} - ${eventDate} - ${eventLocation}`,
  };
}

export function getAdminNotificationEmail(
  userName: string,
  userEmail: string,
  userPhone: string,
  eventTitle: string,
  eventDate: string,
  approvalLink: string,
  registrationId: string
) {
  return {
    subject: `Nouvelle inscription en attente - ${eventTitle}`,
    htmlContent: `<!DOCTYPE html><html><body style="font-family: Arial, sans-serif;">
      <h2>Nouvelle inscription en attente</h2>
      <p><strong>Événement :</strong> ${eventTitle}<br/>
      <strong>Date :</strong> ${eventDate}</p>
      <p><strong>Participant :</strong> ${userName}<br/>
      <strong>Email :</strong> ${userEmail}<br/>
      <strong>Téléphone :</strong> ${userPhone}<br/>
      <strong>ID inscription :</strong> ${registrationId}</p>
      <p><a href="${approvalLink}">Gérer les inscriptions</a></p>
    </body></html>`,
    textContent: `Nouvelle inscription: ${eventTitle} (${eventDate}) - ${userName} ${userEmail} ${userPhone} ID:${registrationId} - Admin: ${approvalLink}`,
  };
}

export function getFinalConfirmationEmail(
  userName: string,
  eventTitle: string,
  eventDate: string,
  eventTime: string | null,
  eventLocation: string,
  eventDescription: string
) {
  return {
    subject: `Inscription validée - ${eventTitle}`,
    htmlContent: `<!DOCTYPE html><html><body style="font-family: Arial, sans-serif;">
      <h2>Bonjour ${userName},</h2>
      <p>Votre inscription a été validée. Nous avons hâte de vous accueillir.</p>
      <hr />
      <p><strong>Événement :</strong> ${eventTitle}<br/>
      <strong>Date :</strong> ${eventDate}<br/>
      ${eventTime ? `<strong>Horaire :</strong> ${eventTime}<br/>` : ''}
      <strong>Lieu :</strong> ${eventLocation}</p>
      <p>${eventDescription}</p>
    </body></html>`,
    textContent: `Bonjour ${userName},\nVotre inscription est validée: ${eventTitle} - ${eventDate} ${eventTime ?? ''} - ${eventLocation}`,
  };
}
