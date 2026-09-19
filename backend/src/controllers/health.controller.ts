import { Request, Response } from 'express';

export const healthCheck = (_req: Request, res: Response): Response => {
  return res.status(200).json({ status: 'ok' });
};
