import { NextRequest, NextResponse } from 'next/server';
import { sendBrevoEmail, sendAdminEmail } from '@/lib/brevo-email';

// Route de test pour vérifier l'envoi d'emails
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get('email') || 'test@example.com';
  const testType = searchParams.get('type') || 'user';

  console.log('🧪 Test d\'envoi d\'email...');
  console.log('📧 Email destinataire:', testEmail);
  console.log('📋 Type de test:', testType);

  try {
    let emailSent = false;

    if (testType === 'admin') {
      // Test email admin
      emailSent = await sendAdminEmail({
        subject: '🧪 Test Email Admin - Centre Social Dorothy',
        htmlContent: `
          <h1>Test Email Admin</h1>
          <p>Ceci est un email de test pour vérifier que l'API Brevo fonctionne correctement.</p>
          <p>Si vous recevez cet email, la configuration est correcte ! ✅</p>
        `,
        textContent: 'Test Email Admin - Si vous recevez cet email, la configuration est correcte !'
      });
    } else {
      // Test email utilisateur
      emailSent = await sendBrevoEmail({
        to: testEmail,
        toName: 'Test Utilisateur',
        subject: '🧪 Test Email - Centre Social Dorothy',
        htmlContent: `
          <h1>Test Email</h1>
          <p>Ceci est un email de test pour vérifier que l'API Brevo fonctionne correctement.</p>
          <p>Si vous recevez cet email, la configuration est correcte ! ✅</p>
        `,
        textContent: 'Test Email - Si vous recevez cet email, la configuration est correcte !'
      });
    }

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: '✅ Email de test envoyé avec succès !',
        details: {
          type: testType,
          recipient: testType === 'admin' ? process.env.ADMIN_EMAIL : testEmail,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ Échec de l\'envoi de l\'email',
        error: 'Vérifiez les logs de la console pour plus de détails'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('❌ Erreur lors du test d\'email:', error);
    return NextResponse.json({
      success: false,
      message: '❌ Erreur lors du test',
      error: error.message
    }, { status: 500 });
  }
}
