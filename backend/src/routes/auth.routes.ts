import { Router } from 'express';

import {
  loginController,
  logoutController,
  signupController,
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimiter';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, signupSchema } from '../validators/user.validator';

const authRouter = Router();

authRouter.post('/signup', authLimiter, validate(signupSchema), signupController);
authRouter.post('/login', authLimiter, validate(loginSchema), loginController);
authRouter.post('/logout', authenticate, logoutController);

export default authRouter;
