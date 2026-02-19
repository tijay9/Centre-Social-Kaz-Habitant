import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { verifyPassword, generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

interface UserResult {
  id: string;
  email: string;
  passwordHash: string | null;
  name: string;
  role: 'ADMIN' | 'USER';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// POST - Connexion utilisateur
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation des champs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur
    const userQuery = 'SELECT * FROM users WHERE email = ? AND active = 1';
    const [rows] = await db.execute(userQuery, [email]) as unknown as [UserResult[]];
    const users = rows;

    if (users.length === 0 || !users[0].passwordHash) {
      // Aucun utilisateur ou mot de passe non défini
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    const user = users[0];
    const passwordHash = user.passwordHash as string;

    // Vérifier le mot de passe (comparaison avec passwordHash)
    const isValidPassword = await verifyPassword(password, passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Générer le token JWT
    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'USER',
    };
    const token = generateToken(authUser);

    // Enregistrer le token dans un cookie httpOnly sécurisé
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24h
    });

    return response;

  } catch (error) {
    console.error('Erreur connexion:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}