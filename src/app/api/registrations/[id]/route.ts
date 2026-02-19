import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, findById, update, deleteById } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';
import { sendBrevoEmail, getFinalConfirmationEmail } from '@/lib/brevo-email';

// GET - Récupérer une inscription spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN', 'MODERATOR'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id: registrationId } = await params;

    // Récupérer l'inscription avec les informations de l'événement
    const [registration] = await executeQuery(`
      SELECT r.*, e.title as eventTitle, e.date as eventDate, e.location as eventLocation
      FROM registrations r
      LEFT JOIN events e ON r.eventId = e.id
      WHERE r.id = ?
    `, [registrationId]) as any[];

    if (!registration) {
      return NextResponse.json(
        { error: 'Inscription non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ registration });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'inscription' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour partiellement une inscription (ex: changer le statut, approuver)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN', 'MODERATOR'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id: registrationId } = await params;
    const body = await request.json();
    const { action, value } = body;

    const existingRegistration = await findById('registrations', registrationId);
    if (!existingRegistration) {
      return NextResponse.json(
        { error: 'Inscription non trouvée' },
        { status: 404 }
      );
    }

    let updateData: any = { updatedAt: new Date() };

    switch (action) {
      case 'approve':
        // Vérifier que l'email a été confirmé
        if (existingRegistration.status !== 'EMAIL_CONFIRMED') {
          return NextResponse.json(
            { error: 'L\'email doit être confirmé avant l\'approbation' },
            { status: 400 }
          );
        }

        updateData.status = 'CONFIRMED';
        updateData.adminApprovedAt = new Date();
        updateData.adminApprovedBy = user.id;

        await update('registrations', registrationId, updateData);

        // Récupérer les détails de l'événement pour l'email
        const event = await findById('events', (existingRegistration as any).eventId) as any;
        
        if (event) {
          const userName = `${(existingRegistration as any).firstName} ${(existingRegistration as any).lastName}`;
          const eventDate = new Date(event.date as string).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          const eventTime = (event.time as string) || '';
          const eventLocation = event.location as string;
          const eventDescription = (event.description as string) || '';

          // Préparer l'email de confirmation finale
          const finalEmailContent = getFinalConfirmationEmail(
            userName,
            event.title as string,
            eventDate,
            eventTime,
            eventLocation,
            eventDescription
          );

          // Envoyer l'email de confirmation finale à l'utilisateur
          const emailSent = await sendBrevoEmail({
            to: (existingRegistration as any).email as string,
            toName: userName,
            subject: finalEmailContent.subject,
            htmlContent: finalEmailContent.htmlContent,
            textContent: finalEmailContent.textContent
          });

          if (!emailSent) {
            console.error('⚠️ Email de confirmation finale non envoyé');
          }
        }

        return NextResponse.json({ 
          message: 'Inscription approuvée avec succès. Un email de confirmation a été envoyé au participant.',
          registration: { ...existingRegistration, ...updateData }
        });

      case 'reject':
        updateData.status = 'CANCELLED';
        await update('registrations', registrationId, updateData);
        
        return NextResponse.json({ 
          message: 'Inscription refusée',
          registration: { ...existingRegistration, ...updateData }
        });

      case 'change_status':
        updateData.status = value;
        await update('registrations', registrationId, updateData);
        
        return NextResponse.json({ 
          message: 'Statut mis à jour avec succès',
          registration: { ...existingRegistration, ...updateData }
        });

      case 'update_info':
        updateData = { ...updateData, ...value };
        await update('registrations', registrationId, updateData);
        
        return NextResponse.json({ 
          message: 'Informations mises à jour avec succès',
          registration: { ...existingRegistration, ...updateData }
        });

      default:
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'inscription' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour complètement une inscription
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN', 'MODERATOR'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id: registrationId } = await params;
    const body = await request.json();

    const existingRegistration = await findById('registrations', registrationId);
    if (!existingRegistration) {
      return NextResponse.json(
        { error: 'Inscription non trouvée' },
        { status: 404 }
      );
    }

    const updateData = {
      ...body,
      updatedAt: new Date()
    };

    // Supprimer les valeurs undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    await update('registrations', registrationId, updateData);

    return NextResponse.json({ message: 'Inscription mise à jour avec succès' });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'inscription' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une inscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN', 'MODERATOR'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id: registrationId } = await params;

    const existingRegistration = await findById('registrations', registrationId);
    if (!existingRegistration) {
      return NextResponse.json(
        { error: 'Inscription non trouvée' },
        { status: 404 }
      );
    }

    await deleteById('registrations', registrationId);

    return NextResponse.json({ message: 'Inscription supprimée avec succès' });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'inscription' },
      { status: 500 }
    );
  }
}