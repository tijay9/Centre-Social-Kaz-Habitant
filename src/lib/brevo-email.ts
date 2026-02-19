// Service d'envoi d'emails avec l'API Brevo via HTTP

// Configuration Brevo (aucune cle en dur dans le code)
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || 'noreply@example.com';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export interface EmailParams {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

// Fonction d'envoi d'email transactionnel via l'API REST Brevo
export async function sendBrevoEmail(params: EmailParams): Promise<boolean> {
  if (!BREVO_API_KEY) {
    console.error('[Brevo] BREVO_API_KEY manquante, email non envoye');
    return false;
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Centre Social Dorothy',
          email: BREVO_SENDER_EMAIL,
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
      console.error('[Brevo] Erreur API', response.status, text);
      return false;
    }

    console.log('[Brevo] Email envoye avec succes', { to: params.to, response: text });
    return true;
  } catch (err) {
    console.error('[Brevo] Erreur lors de l’envoi d’email', err);
    return false;
  }
}

// Fonction pour envoyer un email a l'administrateur
export async function sendAdminEmail(params: Omit<EmailParams, 'to' | 'toName'>): Promise<boolean> {
  if (!ADMIN_EMAIL) {
    console.error('[Brevo] ADMIN_EMAIL manquant, email admin non envoye');
    return false;
  }

  return sendBrevoEmail({
    to: ADMIN_EMAIL,
    toName: 'Administrateur Dorothy',
    ...params,
  });
}

// Template: Email de confirmation pour l'utilisateur
export function getUserConfirmationEmail(
  userName: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  confirmationLink: string
) {
  return {
    subject: `Confirmez votre inscription - ${eventTitle}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #fc7f2b, #37a599); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Centre Social Dorothy</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Confirmez votre inscription</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Bonjour ${userName},</h2>
                    
                    <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                      Merci pour votre demande d'inscription à notre événement. Pour finaliser votre inscription, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
                    </p>
                    
                    <!-- Event Details Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0; border-left: 4px solid #fc7f2b;">
                      <tr>
                        <td style="padding: 20px;">
                          <h3 style="color: #fc7f2b; margin: 0 0 15px 0; font-size: 18px;">📅 Détails de l'événement</h3>
                          <p style="margin: 8px 0; color: #333333; font-size: 15px;">
                            <strong>Événement :</strong> ${eventTitle}
                          </p>
                          <p style="margin: 8px 0; color: #333333; font-size: 15px;">
                            <strong>Date :</strong> ${eventDate}
                          </p>
                          <p style="margin: 8px 0; color: #333333; font-size: 15px;">
                            <strong>Lieu :</strong> ${eventLocation}
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${confirmationLink}" style="display: inline-block; background: linear-gradient(135deg, #fc7f2b, #e66a1f); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(252, 127, 43, 0.3);">
                            ✓ Confirmer mon inscription
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; padding-top: 20px; border-top: 1px solid #eeeeee;">
                      <strong>⚠️ Important :</strong> Après votre confirmation, votre inscription sera soumise à l'approbation de notre équipe. Vous recevrez un email de confirmation finale une fois validée.
                    </p>
                    
                    <p style="color: #999999; font-size: 13px; margin: 15px 0 0 0;">
                      Ce lien expirera dans 24 heures. Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0 0 10px 0; color: #333333; font-weight: bold; font-size: 14px;">Centre Social Kaz'Habitant - Dorothy</p>
                    <p style="margin: 0 0 5px 0; color: #666666; font-size: 13px;">Les Hauts de Dillon, Résidence Capitole 3 - Bât 4</p>
                    <p style="margin: 0 0 5px 0; color: #666666; font-size: 13px;">97200 Fort-de-France, Martinique</p>
                    <p style="margin: 0; color: #666666; font-size: 13px;">📞 0696 00 01 69 / 0696 61 36 03</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    textContent: `Bonjour ${userName},

Merci pour votre demande d'inscription à ${eventTitle}.

Pour confirmer votre inscription, veuillez cliquer sur ce lien : ${confirmationLink}

Détails de l'événement :
- Événement : ${eventTitle}
- Date : ${eventDate}
- Lieu : ${eventLocation}

Ce lien expirera dans 24 heures.

Centre Social Dorothy`
  };
}

// Template: Notification admin pour nouvelle inscription
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
    subject: `🔔 Nouvelle inscription en attente - ${eventTitle}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #fc7f2b, #e66a1f); padding: 25px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🔔 Notification Administrateur</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 35px 30px;">
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                      <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ Action requise : Nouvelle inscription à approuver</p>
                    </div>
                    
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 20px;">Nouvelle demande d'inscription</h2>
                    
                    <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
                      Un participant a confirmé son email et souhaite s'inscrire à l'événement suivant :
                    </p>
                    
                    <!-- Event Info -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 20px 0; border-left: 4px solid #fc7f2b;">
                      <tr>
                        <td style="padding: 20px;">
                          <h3 style="color: #fc7f2b; margin: 0 0 15px 0; font-size: 16px;">📅 Événement</h3>
                          <p style="margin: 5px 0; color: #333333;"><strong>${eventTitle}</strong></p>
                          <p style="margin: 5px 0; color: #666666; font-size: 14px;">${eventDate}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- User Info -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f5e9; border-radius: 8px; margin: 20px 0; border-left: 4px solid #37a599;">
                      <tr>
                        <td style="padding: 20px;">
                          <h3 style="color: #37a599; margin: 0 0 15px 0; font-size: 16px;">👤 Informations du participant</h3>
                          <p style="margin: 5px 0; color: #333333;"><strong>Nom :</strong> ${userName}</p>
                          <p style="margin: 5px 0; color: #333333;"><strong>Email :</strong> ${userEmail}</p>
                          <p style="margin: 5px 0; color: #333333;"><strong>Téléphone :</strong> ${userPhone}</p>
                          <p style="margin: 5px 0; color: #999999; font-size: 13px;"><strong>ID :</strong> ${registrationId}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Action Buttons -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${approvalLink}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                            ✓ Gérer les inscriptions
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #999999; font-size: 13px; line-height: 1.6; margin: 25px 0 0 0; padding-top: 20px; border-top: 1px solid #eeeeee;">
                      Connectez-vous à l'interface d'administration pour accepter ou refuser cette inscription.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; color: #666666; font-size: 13px;">Centre Social Dorothy - Système d'administration</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    textContent: `NOTIFICATION ADMINISTRATEUR

Nouvelle inscription en attente d'approbation

Événement : ${eventTitle}
Date : ${eventDate}

Participant :
- Nom : ${userName}
- Email : ${userEmail}
- Téléphone : ${userPhone}

Pour approuver cette inscription, connectez-vous à l'interface d'administration : ${approvalLink}

Centre Social Dorothy`
  };
}

// Template: Confirmation finale après approbation admin
export function getFinalConfirmationEmail(
  userName: string,
  eventTitle: string,
  eventDate: string,
  eventTime: string,
  eventLocation: string,
  eventDescription: string
) {
  return {
    subject: `✅ Inscription validée - ${eventTitle}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✅ Inscription Confirmée !</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Bonjour ${userName},</h2>
                    
                    <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #065f46; font-weight: bold; font-size: 16px;">🎉 Excellente nouvelle !</p>
                      <p style="margin: 10px 0 0 0; color: #065f46;">Votre inscription a été validée par notre équipe. Nous avons hâte de vous accueillir !</p>
                    </div>
                    
                    <!-- Event Details -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fff8f3, #fff); border-radius: 12px; margin: 30px 0; border: 2px solid #fc7f2b; box-shadow: 0 2px 8px rgba(252, 127, 43, 0.1);">
                      <tr>
                        <td style="padding: 25px;">
                          <h3 style="color: #fc7f2b; margin: 0 0 20px 0; font-size: 20px; text-align: center;">📋 Récapitulatif de votre inscription</h3>
                          
                          <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                                <p style="margin: 0; color: #999999; font-size: 13px;">Événement</p>
                                <p style="margin: 5px 0 0 0; color: #333333; font-weight: bold; font-size: 16px;">${eventTitle}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                                <p style="margin: 0; color: #999999; font-size: 13px;">Date</p>
                                <p style="margin: 5px 0 0 0; color: #333333; font-weight: bold;">${eventDate}</p>
                              </td>
                            </tr>
                            ${eventTime ? `
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                                <p style="margin: 0; color: #999999; font-size: 13px;">Horaire</p>
                                <p style="margin: 5px 0 0 0; color: #333333; font-weight: bold;">${eventTime}</p>
                              </td>
                            </tr>
                            ` : ''}
                            <tr>
                              <td style="padding: 10px 0;">
                                <p style="margin: 0; color: #999999; font-size: 13px;">Lieu</p>
                                <p style="margin: 5px 0 0 0; color: #333333; font-weight: bold;">${eventLocation}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    ${eventDescription ? `
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <h4 style="color: #333333; margin: 0 0 10px 0; font-size: 16px;">À propos de l'événement</h4>
                      <p style="color: #666666; line-height: 1.6; margin: 0; font-size: 14px;">${eventDescription}</p>
                    </div>
                    ` : ''}
                    
                    <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #6271dd;">
                      <h4 style="color: #6271dd; margin: 0 0 10px 0; font-size: 15px;">📌 Informations pratiques</h4>
                      <ul style="margin: 10px 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
                        <li>Merci de vous présenter 10 minutes avant le début</li>
                        <li>N'oubliez pas d'apporter une pièce d'identité si nécessaire</li>
                        <li>En cas d'empêchement, prévenez-nous au plus tôt</li>
                      </ul>
                    </div>
                    
                    <p style="color: #666666; line-height: 1.6; margin: 20px 0; font-size: 15px;">
                      Si vous avez des questions ou besoin d'informations supplémentaires, n'hésitez pas à nous contacter.
                    </p>
                    
                    <p style="color: #333333; margin: 25px 0 0 0; font-size: 16px;">
                      À très bientôt ! 👋<br>
                      <strong>L'équipe du Centre Social Dorothy</strong>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0 0 10px 0; color: #333333; font-weight: bold; font-size: 14px;">Centre Social Kaz'Habitant - Dorothy</p>
                    <p style="margin: 0 0 5px 0; color: #666666; font-size: 13px;">Les Hauts de Dillon, Résidence Capitole 3 - Bât 4</p>
                    <p style="margin: 0 0 5px 0; color: #666666; font-size: 13px;">97200 Fort-de-France, Martinique</p>
                    <p style="margin: 0 0 10px 0; color: #666666; font-size: 13px;">📞 0696 00 01 69 / 0696 61 36 03</p>
                    <p style="margin: 0; color: #666666; font-size: 13px;">✉️ associationdorothy@live.fr</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    textContent: `INSCRIPTION CONFIRMÉE !

Bonjour ${userName},

Votre inscription a été validée ! Nous avons hâte de vous accueillir.

RÉCAPITULATIF :

Événement : ${eventTitle}
Date : ${eventDate}
${eventTime ? `Horaire : ${eventTime}
` : ''}Lieu : ${eventLocation}

Merci de vous présenter 10 minutes avant le début.

À très bientôt !
L'équipe du Centre Social Dorothy

📞 0696 00 01 69 / 0696 61 36 03
✉️ associationdorothy@live.fr`
  };
}
