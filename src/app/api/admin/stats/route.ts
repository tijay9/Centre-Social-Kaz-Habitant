import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';

interface CountResult {
  count: number;
}

interface EventsByCategory {
  category: string;
  count: number;
  status: string;
}

interface RegistrationsByMonth {
  month: string;
  count: number;
}

interface PopularEvent {
  id: string;
  title: string;
  date: Date;
  category: string;
  registrationCount: number;
}

interface RecentContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  createdAt: Date;
}

interface RecentRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: Date;
  eventTitle: string;
}

interface CategoryStats {
  total: number;
  published: number;
  draft: number;
}

// GET - Récupérer les statistiques pour l'administration
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['ADMIN'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Statistiques générales
    const [eventsCount] = await executeQuery(`
      SELECT COUNT(*) as count FROM events
    `) as CountResult[];

    const [publishedEventsCount] = await executeQuery(`
      SELECT COUNT(*) as count FROM events WHERE status = 'PUBLISHED'
    `) as CountResult[];

    const [teamMembersCount] = await executeQuery(`
      SELECT COUNT(*) as count FROM team_members WHERE active = 1
    `) as CountResult[];

    const [registrationsCount] = await executeQuery(`
      SELECT COUNT(*) as count FROM registrations
    `) as CountResult[];

    const [contactsCount] = await executeQuery(`
      SELECT COUNT(*) as count FROM contacts
    `) as CountResult[];

    const [pendingContactsCount] = await executeQuery(`
      SELECT COUNT(*) as count FROM contacts WHERE status = 'NEW'
    `) as CountResult[];

    // Statistiques par catégorie
    const eventsByCategory = await executeQuery(`
      SELECT category, COUNT(*) as count, status
      FROM events
      GROUP BY category, status
      ORDER BY category, status
    `) as EventsByCategory[];

    // Inscriptions par mois (12 derniers mois)
    const registrationsByMonth = await executeQuery(`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        COUNT(*) as count
      FROM registrations
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month ASC
    `) as RegistrationsByMonth[];

    // Événements les plus populaires (par nombre d'inscriptions)
    const popularEvents = await executeQuery(`
      SELECT 
        e.id, e.title, e.date, e.category,
        COUNT(r.id) as registrationCount
      FROM events e
      LEFT JOIN registrations r ON e.id = r.eventId
      WHERE e.status = 'PUBLISHED'
      GROUP BY e.id, e.title, e.date, e.category
      ORDER BY registrationCount DESC
      LIMIT 10
    `) as PopularEvent[];

    // Contacts récents
    const recentContacts = await executeQuery(`
      SELECT id, name, email, subject, status, createdAt
      FROM contacts
      ORDER BY createdAt DESC
      LIMIT 5
    `) as RecentContact[];

    // Inscriptions récentes
    const recentRegistrations = await executeQuery(`
      SELECT 
        r.id, r.firstName, r.lastName, r.email, r.status, r.createdAt,
        e.title as eventTitle
      FROM registrations r
      LEFT JOIN events e ON r.eventId = e.id
      ORDER BY r.createdAt DESC
      LIMIT 5
    `) as RecentRegistration[];

    const stats = {
      overview: {
        totalEvents: eventsCount?.count || 0,
        publishedEvents: publishedEventsCount?.count || 0,
        activeTeamMembers: teamMembersCount?.count || 0,
        totalRegistrations: registrationsCount?.count || 0,
        totalContacts: contactsCount?.count || 0,
        pendingContacts: pendingContactsCount?.count || 0
      },
      eventsByCategory: eventsByCategory.reduce((acc: Record<string, CategoryStats>, item: EventsByCategory) => {
        if (!acc[item.category]) {
          acc[item.category] = { total: 0, published: 0, draft: 0 };
        }
        acc[item.category].total += item.count;
        if (item.status === 'PUBLISHED') {
          acc[item.category].published = item.count;
        } else if (item.status === 'DRAFT') {
          acc[item.category].draft = item.count;
        }
        return acc;
      }, {} as Record<string, CategoryStats>),
      registrationsByMonth: registrationsByMonth.map((item: RegistrationsByMonth) => ({
        month: item.month,
        count: item.count
      })),
      popularEvents: popularEvents.map((item: PopularEvent) => ({
        id: item.id,
        title: item.title,
        date: item.date,
        category: item.category,
        registrations: item.registrationCount
      })),
      recentActivity: {
        contacts: recentContacts,
        registrations: recentRegistrations
      }
    };

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques admin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}