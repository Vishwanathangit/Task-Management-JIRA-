import { NextFunction, Request, Response } from 'express';

import { TaskStatus } from '../constants/taskStatus';
import {
  assignTask,
  createTask,
  getAllTasks,
  getTaskById,
  softDeleteTask,
  updateTask,
  updateTaskStatus,
} from '../services/task.service';
import { createAppError } from '../utils/AppError';

export const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(createAppError('Unauthorized', 401));
    }
    const task = await createTask(req.body, req.user.userId);
    res.status(201).json({
      status: 'success',
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllTasksController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters = {
      projectId: req.query.projectId as string | undefined,
      assignedTo: req.query.assignedTo as string | undefined,
      status: req.query.status as TaskStatus | undefined,
    };
    const tasks = await getAllTasks(filters);
    res.status(200).json({
      status: 'success',
      data: { tasks },
    });
  } catch (err) {
    next(err);
  }
};

export const getTaskByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await getTaskById(req.params.id as string);
    res.status(200).json({
      status: 'success',
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

export const updateTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(createAppError('Unauthorized', 401));
    }
    const task = await updateTask(req.params.id as string, req.body, req.user.userId);
    res.status(200).json({
      status: 'success',
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

export const assignTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(createAppError('Unauthorized', 401));
    }
    const task = await assignTask(
      req.params.id as string,
      req.body.assignedTo as string,
      req.user.userId
    );
    res.status(200).json({
      status: 'success',
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

export const updateTaskStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(createAppError('Unauthorized', 401));
    }
    const task = await updateTaskStatus(
      req.params.id as string,
      req.body.status as TaskStatus,
      req.user.userId
    );
    res.status(200).json({
      status: 'success',
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(createAppError('Unauthorized', 401));
    }
    await softDeleteTask(req.params.id as string, req.user.userId);
    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
