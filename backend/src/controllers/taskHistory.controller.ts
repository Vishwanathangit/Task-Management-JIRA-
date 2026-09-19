import { NextFunction, Request, Response } from 'express';

import { getHistoryForTask, getTaskTimeline } from '../services/taskHistory.service';

export const getTaskHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const taskId = req.params.id as string;
    const history = await getHistoryForTask(taskId);
    res.status(200).json({
      status: 'success',
      data: { history },
    });
  } catch (err) {
    next(err);
  }
};

export const getTaskTimelineController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const taskId = req.params.id as string;
    const timeline = await getTaskTimeline(taskId);
    res.status(200).json({
      status: 'success',
      data: { timeline },
    });
  } catch (err) {
    next(err);
  }
};
