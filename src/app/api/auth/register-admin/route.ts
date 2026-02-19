import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 },
      );
    }

    // Vérifier si un utilisateur existe déjà avec cet email
    const [existingRows] = (await db.execute('SELECT id FROM users WHERE email = ?', [email])) as any;
    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 },
      );
    }

    const hashedPassword = await hashPassword(password);

    const query = `
      INSERT INTO users (email, passwordHash, name, role, active, createdAt, updatedAt)
      VALUES (?, ?, ?, 'ADMIN', 1, NOW(), NOW())
    `;

    await db.execute(query, [email, hashedPassword, name]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur register-admin:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 },
    );
  }
}
