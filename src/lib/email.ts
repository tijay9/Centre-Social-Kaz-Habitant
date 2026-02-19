import nodemailer from 'nodemailer';

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Envoi d'email
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      replyTo: process.env.SMTP_REPLY_TO || process.env.SMTP_FROM,
      ...options,
    });
    return true;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return false;
  }
}

// Templates d'emails
export const emailTemplates = {
  contactConfirmation: (name: string) => ({
    subject: 'Confirmation de réception - Centre Social Dorothy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #fc7f2b, #37a599); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Centre Social Dorothy</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Bonjour ${name},</h2>
          <p style="color: #666; line-height: 1.6;">
            Nous avons bien reçu votre message et vous remercions de nous avoir contactés.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <div style="background: white; padding: 15px; border-left: 4px solid #fc7f2b; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>Centre Social Kaz'Habitant - Dorothy</strong></p>
            <p style="margin: 5px 0 0 0; color: #666;">Martinique</p>
          </div>
        </div>
      </div>
    `,
    text: `Bonjour ${name}, nous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais.`
  }),

  eventRegistration: (name: string, eventTitle: string, eventDate: string) => ({
    subject: `Inscription confirmée - ${eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #fc7f2b, #37a599); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Inscription confirmée</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Bonjour ${name},</h2>
          <p style="color: #666; line-height: 1.6;">
            Votre inscription à l'événement <strong>${eventTitle}</strong> a été confirmée.
          </p>
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #fc7f2b; margin-top: 0;">Détails de l'événement</h3>
            <p style="margin: 5px 0;"><strong>Événement :</strong> ${eventTitle}</p>
            <p style="margin: 5px 0;"><strong>Date :</strong> ${eventDate}</p>
          </div>
          <p style="color: #666; line-height: 1.6;">
            Nous avons hâte de vous voir !
          </p>
        </div>
      </div>
    `,
    text: `Bonjour ${name}, votre inscription à ${eventTitle} le ${eventDate} a été confirmée.`
  }),

  adminNotification: (type: string, details: string) => ({
    subject: `[Dorothy Admin] ${type}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #fc7f2b; padding: 15px;">
          <h2 style="color: white; margin: 0;">Notification Administrateur</h2>
        </div>
        <div style="padding: 20px; background: white;">
          <h3>${type}</h3>
          <p>${details}</p>
          <p style="color: #666; font-size: 12px;">
            Connectez-vous à l'interface d'administration pour plus de détails.
          </p>
        </div>
      </div>
    `,
    text: `${type}: ${details}`
  })
};