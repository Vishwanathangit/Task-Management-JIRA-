import { Router } from 'express';

import authRouter from './auth.routes';
import healthRouter from './health.routes';
import projectRouter from './project.routes';
import taskRouter from './task.routes';

const rootRouter = Router();
const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/health', healthRouter);
v1Router.use('/project', projectRouter);
v1Router.use('/task', taskRouter);

rootRouter.use('/v1', v1Router);

export default rootRouter;
