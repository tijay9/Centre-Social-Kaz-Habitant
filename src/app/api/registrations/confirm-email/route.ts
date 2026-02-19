import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, update, findById } from '@/lib/database';
import { sendBrevoEmail, sendAdminEmail, getAdminNotificationEmail } from '@/lib/brevo-email';

// GET - Confirmer l'email de l'utilisateur via le token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token de confirmation manquant' },
        { status: 400 }
      );
    }

    // Rechercher l'inscription avec ce token
    const [registration] = await executeQuery(
      'SELECT * FROM registrations WHERE emailToken = ?',
      [token]
    ) as any[];

    if (!registration) {
      return NextResponse.redirect(
        new URL('/evenements?error=token_invalide', request.url)
      );
    }

    // Vérifier si le token n'a pas expiré
    const now = new Date();
    const tokenExpiry = new Date(registration.emailTokenExpiry);
    
    if (now > tokenExpiry) {
      return NextResponse.redirect(
        new URL('/evenements?error=token_expire', request.url)
      );
    }

    // Vérifier si l'email n'est pas déjà confirmé
    if (registration.status === 'EMAIL_CONFIRMED' || registration.status === 'CONFIRMED') {
      return NextResponse.redirect(
        new URL('/evenements?success=deja_confirme', request.url)
      );
    }

    // Mettre à jour le statut de l'inscription
    await update('registrations', registration.id, {
      status: 'EMAIL_CONFIRMED',
      emailConfirmedAt: new Date(),
      emailToken: null, // Supprimer le token après utilisation
      updatedAt: new Date()
    });

    // Récupérer les détails de l'événement
    const event = await findById('events', registration.eventId) as any;
    
    if (!event) {
      return NextResponse.redirect(
        new URL('/evenements?error=evenement_introuvable', request.url)
      );
    }

    // Préparer les informations pour l'email admin
    const userName = `${registration.firstName} ${registration.lastName}`;
    const eventDate = new Date(event.date as string).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Créer le lien vers la page d'administration des inscriptions
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const approvalLink = `${baseUrl}/admin/registrations`;

    // Préparer l'email de notification pour l'admin
    const adminEmailContent = getAdminNotificationEmail(
      userName,
      registration.email,
      registration.phone,
      event.title as string,
      eventDate,
      approvalLink,
      registration.id
    );

    // Envoyer l'email de notification à l'admin (utilise ADMIN_EMAIL depuis .env)
    const adminEmailSent = await sendAdminEmail({
      subject: adminEmailContent.subject,
      htmlContent: adminEmailContent.htmlContent,
      textContent: adminEmailContent.textContent
    });

    if (!adminEmailSent) {
      console.error('⚠️ Email de notification admin non envoyé');
    }

    // Rediriger vers une page de succès
    return NextResponse.redirect(
      new URL(`/evenements?success=email_confirme&event=${event.id}`, request.url)
    );

  } catch (error) {
    console.error('Erreur lors de la confirmation de l\'email:', error);
    return NextResponse.redirect(
      new URL('/evenements?error=erreur_serveur', request.url)
    );
  }
}
