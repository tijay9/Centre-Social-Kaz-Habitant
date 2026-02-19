import { NextRequest, NextResponse } from 'next/server';

// Statistiques mockées simples
const mockStatistics = {
  events: 15,
  teamMembers: 8,
  registrations: 45,
  galleryImages: 25,
  activeUsers: 120,
  categories: {
    seniors: 6,
    reeap: 4,
    laep: 3,
    jeunesse: 2
  }
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(mockStatistics);
  } catch (error) {
    console.error('Erreur API statistics:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}