import { z } from 'zod';

import { TASK_STATUS } from '../constants/taskStatus';

export const createTaskSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  assignedTo: z.string().uuid('Invalid assigned user ID').optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(2, 'Title must be at least 2 characters').optional(),
    description: z.string().optional(),
  })
  .refine((data) => data.title !== undefined || data.description !== undefined, {
    message: 'At least one field (title or description) must be provided for update',
  });

export const updateStatusSchema = z.object({
  status: z.enum([
    TASK_STATUS.TODO,
    TASK_STATUS.IN_PROGRESS,
    TASK_STATUS.COMPLETED,
    TASK_STATUS.STAGING,
    TASK_STATUS.PRODUCTION,
    TASK_STATUS.CLOSED,
  ]),
});

export const assignTaskSchema = z.object({
  assignedTo: z.string().uuid('Invalid assigned user ID'),
});

export type ITaskInput = z.infer<typeof createTaskSchema>;
export type IUpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type IUpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type IAssignTaskInput = z.infer<typeof assignTaskSchema>;
