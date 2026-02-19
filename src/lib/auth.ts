import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export function requireAuth(request: NextRequest): AuthUser | null {
  try {
    // Priorité : cookie httpOnly
    const cookieToken = request.cookies.get('auth_token')?.value;

    // Compatibilité : header Authorization Bearer
    const authHeader = request.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined;

    const token = cookieToken || headerToken;

    if (!token) {
      console.log('No auth token found (cookie or header)');
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    console.log('Token verified for user:', decoded.email);
    return decoded;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Auth error:', message);
    return null;
  }
}

export function hasPermission(userRole: string, allowedRoles: string[]): boolean {
  const hasAccess = allowedRoles.includes(userRole);
  console.log(`Permission check: ${userRole} in [${allowedRoles.join(', ')}] = ${hasAccess}`);
  return hasAccess;
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
