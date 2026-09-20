import { NextFunction, Request, Response } from 'express';

import {
  createProject,
  getAllProjects,
  getProjectById,
  softDeleteProject,
  updateProject,
} from '../services/project.service';
import { createAppError } from '../utils/AppError';
import { projectQuerySchema } from '../validators/project.validator';

export const createProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(createAppError('Unauthorized', 401));
    }
    const project = await createProject(req.body, req.user.userId);
    res.status(201).json({
      status: 'success',
      data: { project },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = projectQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((i) => i.message).join(', ');
      return next(createAppError(errorMessage, 400));
    }

    const { search, fromDate, toDate, page, limit } = parsed.data;
    const { projects, pagination } = await getAllProjects({
      search,
      fromDate,
      toDate,
      page,
      limit,
    });
    res.status(200).json({
      status: 'success',
      data: { projects, pagination },
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await getProjectById(req.params.id as string);
    res.status(200).json({
      status: 'success',
      data: { project },
    });
  } catch (err) {
    next(err);
  }
};

export const updateProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(createAppError('Unauthorized', 401));
    }
    const project = await updateProject(req.params.id as string, req.body, req.user.userId);
    res.status(200).json({
      status: 'success',
      data: { project },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await softDeleteProject(req.params.id as string);
    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
