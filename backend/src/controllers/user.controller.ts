import { NextFunction, Request, Response } from 'express';

import { getAllUsers, getUserById } from '../services/user.service';

export const getAllUsersController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      status: 'success',
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await getUserById(req.params.id as string);
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};
