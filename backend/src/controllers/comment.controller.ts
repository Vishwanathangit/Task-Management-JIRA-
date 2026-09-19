import { NextFunction, Request, Response } from 'express';

import { addComment, getCommentsForTask } from '../services/comment.service';
import { createAppError } from '../utils/AppError';

export const addCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(createAppError('Unauthorized', 401));
    }
    const taskId = req.params.id as string;
    const comment = await addComment(taskId, req.user.userId, req.body.message);
    res.status(201).json({
      status: 'success',
      data: { comment },
    });
  } catch (err) {
    next(err);
  }
};

export const getCommentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const taskId = req.params.id as string;
    const commentsList = await getCommentsForTask(taskId);
    res.status(200).json({
      status: 'success',
      data: { comments: commentsList },
    });
  } catch (err) {
    next(err);
  }
};
