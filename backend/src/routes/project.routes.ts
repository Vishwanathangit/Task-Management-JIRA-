import { Router } from 'express';

import { ROLES } from '../constants/roles';
import {
  createProjectController,
  deleteProjectController,
  getAllProjectsController,
  getProjectByIdController,
  updateProjectController,
} from '../controllers/project.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';

const projectRouter = Router();

projectRouter.post(
  '/',
  authenticate,
  authorize(ROLES.PM),
  validate(createProjectSchema),
  createProjectController
);
projectRouter.get('/', authenticate, getAllProjectsController);
projectRouter.get('/:id', authenticate, getProjectByIdController);
projectRouter.patch(
  '/:id',
  authenticate,
  authorize(ROLES.PM),
  validate(updateProjectSchema),
  updateProjectController
);
projectRouter.delete('/:id', authenticate, authorize(ROLES.PM), deleteProjectController);

export default projectRouter;
