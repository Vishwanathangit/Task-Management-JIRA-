import { NextFunction, Request, Response } from 'express';
import { z, ZodSchema } from 'zod';

import { createAppError } from '../utils/AppError';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue: z.ZodIssue): string => issue.message)
        .join(', ');
      return next(createAppError(errorMessage, 400));
    }
    req.body = result.data;
    next();
  };
