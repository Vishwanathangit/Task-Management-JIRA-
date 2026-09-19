import { NextFunction, Request, Response } from 'express';

import { env } from '../config/env';
import { login, signup } from '../services/auth.service';

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await signup(req.body);
    res.status(201).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user, token } = await login(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({
      status: 'success',
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutController = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
};
