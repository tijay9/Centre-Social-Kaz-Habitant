import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

// GET - Vérifier le statut d'authentification
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    
    if (!auth) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: auth.id,
        email: auth.email,
        name: auth.name,
        role: auth.role
      }
    });

  } catch (error) {
    console.error('Erreur vérification auth:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}