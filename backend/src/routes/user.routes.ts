import { Router } from 'express';

import { getAllUsersController, getUserByIdController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const userRouter = Router();

userRouter.get('/', authenticate, getAllUsersController);
userRouter.get('/:id', authenticate, getUserByIdController);

export default userRouter;
