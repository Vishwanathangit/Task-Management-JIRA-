import { NextFunction, Request, Response } from 'express';

import { Role } from '../constants/roles';
import { createAppError } from '../utils/AppError';
import { verifyToken } from '../utils/jwt';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  let token: string | undefined = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(createAppError('Authentication token missing', 401));
  }

  const payload = verifyToken(token);
  if (!payload) {
    return next(createAppError('Invalid or expired token', 401));
  }

  req.user = payload;
  next();
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(createAppError('Forbidden: insufficient permissions', 403));
    }
    next();
  };
};
