import { z } from 'zod';

import { TASK_STATUS } from '@/constants/taskStatus';

export const createTaskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').optional(),
  description: z.string().optional(),
});

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

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

export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

export const assignTaskSchema = z.object({
  assignedTo: z.string().min(1, 'Please select an assignee'),
});

export type AssignTaskFormData = z.infer<typeof assignTaskSchema>;

export const addCommentSchema = z.object({
  message: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment max 1000 characters'),
});

export type AddCommentFormData = z.infer<typeof addCommentSchema>;
