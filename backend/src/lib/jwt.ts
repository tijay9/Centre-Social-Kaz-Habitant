import jwt from 'jsonwebtoken';
import { getEnv } from './env';

export type JwtRole = 'ADMIN' | 'USER';

export interface JwtUser {
  id: number;
  email: string;
  name: string;
  role: JwtRole;
}

export function signJwt(user: JwtUser): string {
  const env = getEnv();
  return jwt.sign(user, env.JWT_SECRET, { expiresIn: '24h' });
}

export function verifyJwt(token: string): JwtUser {
  const env = getEnv();
  return jwt.verify(token, env.JWT_SECRET) as JwtUser;
}
