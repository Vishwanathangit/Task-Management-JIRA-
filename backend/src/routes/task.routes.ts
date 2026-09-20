import { Router } from 'express';

import { ROLES } from '../constants/roles';
import {
  addCommentController,
  getCommentsController,
} from '../controllers/comment.controller';
import {
  assignTaskController,
  createTaskController,
  deleteTaskController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
  updateTaskStatusController,
} from '../controllers/task.controller';
import {
  getTaskHistoryController,
  getTaskTimelineController,
} from '../controllers/taskHistory.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { addCommentSchema } from '../validators/comment.validator';
import {
  assignTaskSchema,
  createTaskSchema,
  updateStatusSchema,
  updateTaskSchema,
} from '../validators/task.validator';

const taskRouter = Router();

taskRouter.post(
  '/',
  authenticate,
  authorize(ROLES.PM, ROLES.SCRUM_MASTER, ROLES.DEVELOPER, ROLES.TESTER),
  validate(createTaskSchema),
  createTaskController
);
taskRouter.get('/', authenticate, getAllTasksController);
taskRouter.get('/:id', authenticate, getTaskByIdController);
taskRouter.patch('/:id', authenticate, validate(updateTaskSchema), updateTaskController);
taskRouter.patch(
  '/:id/assign',
  authenticate,
  authorize(ROLES.PM, ROLES.SCRUM_MASTER),
  validate(assignTaskSchema),
  assignTaskController
);
taskRouter.patch(
  '/:id/status',
  authenticate,
  validate(updateStatusSchema),
  updateTaskStatusController
);
taskRouter.delete(
  '/:id',
  authenticate,
  authorize(ROLES.PM, ROLES.SCRUM_MASTER),
  deleteTaskController
);

taskRouter.post('/:id/comments', authenticate, validate(addCommentSchema), addCommentController);
taskRouter.get('/:id/comments', authenticate, getCommentsController);
taskRouter.get('/:id/history', authenticate, getTaskHistoryController);
taskRouter.get('/:id/timeline', authenticate, getTaskTimelineController);

export default taskRouter;
