import jwt, { Secret } from 'jsonwebtoken';

import { env } from '../config/env';
import { Role } from '../constants/roles';

export interface TokenPayload {
  userId: string;
  role: Role;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret: Secret = env.JWT_SECRET;
  return jwt.sign(payload, secret, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const secret: Secret = env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as TokenPayload;
    if (decoded && typeof decoded.userId === 'string' && typeof decoded.role === 'string') {
      return { userId: decoded.userId, role: decoded.role };
    }
    return null;
  } catch {
    return null;
  }
};
