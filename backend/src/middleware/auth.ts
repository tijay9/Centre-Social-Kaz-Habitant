import type { Request, Response, NextFunction } from 'express';
import { verifyJwt, type JwtUser } from '../lib/jwt';

export interface AuthedRequest extends Request {
  user?: JwtUser;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;

  if (!token) return res.status(401).json({ error: 'Missing Authorization Bearer token' });

  try {
    req.user = verifyJwt(token);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  return next();
}
