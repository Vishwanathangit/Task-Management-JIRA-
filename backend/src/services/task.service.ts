import { and, eq, isNull } from 'drizzle-orm';

import { db } from '../config/db';
import { TASK_ACTIONS } from '../constants/taskAction';
import { TaskStatus } from '../constants/taskStatus';
import { tasks } from '../models/task.model';
import { ITask, ITaskInput, IUpdateTaskInput } from '../types/task.types';
import { createAppError } from '../utils/AppError';
import { recordTaskHistory } from '../utils/recordTaskHistory';

export const createTask = async (input: ITaskInput, creatorId: string): Promise<ITask> => {
  const [newTask] = await db
    .insert(tasks)
    .values({
      projectId: input.projectId,
      title: input.title,
      description: input.description ?? null,
      assignedTo: input.assignedTo ?? null,
      createdBy: creatorId,
    })
    .returning();

  if (!newTask) {
    throw createAppError('Failed to create task', 500);
  }

  await recordTaskHistory({
    taskId: newTask.id,
    actorId: creatorId,
    action: TASK_ACTIONS.CREATED,
    toValue: newTask.status,
    note: `Task created: ${newTask.title}`,
  });

  return newTask as ITask;
};

export const getAllTasks = async (filters?: {
  projectId?: string;
  assignedTo?: string;
  status?: TaskStatus;
}): Promise<ITask[]> => {
  const conditions = [isNull(tasks.deletedAt)];

  if (filters?.projectId) {
    conditions.push(eq(tasks.projectId, filters.projectId));
  }
  if (filters?.assignedTo) {
    conditions.push(eq(tasks.assignedTo, filters.assignedTo));
  }
  if (filters?.status) {
    conditions.push(eq(tasks.status, filters.status));
  }

  const result = await db
    .select()
    .from(tasks)
    .where(and(...conditions));

  return result as ITask[];
};

export const getTaskById = async (taskId: string): Promise<ITask> => {
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), isNull(tasks.deletedAt)));

  if (!task) {
    throw createAppError('Task not found', 404);
  }

  return task as ITask;
};

export const updateTask = async (
  taskId: string,
  input: IUpdateTaskInput,
  actorId: string
): Promise<ITask> => {
  const existingTask = await getTaskById(taskId);

  const updateData: Partial<typeof tasks.$inferInsert> = {
    updatedAt: new Date(),
  };

  const changedFields: string[] = [];
  if (input.title !== undefined) {
    updateData.title = input.title;
    changedFields.push('title');
  }
  if (input.description !== undefined) {
    updateData.description = input.description;
    changedFields.push('description');
  }

  const [updatedTask] = await db
    .update(tasks)
    .set(updateData)
    .where(eq(tasks.id, existingTask.id))
    .returning();

  if (!updatedTask) {
    throw createAppError('Failed to update task', 500);
  }

  await recordTaskHistory({
    taskId: updatedTask.id,
    actorId,
    action: TASK_ACTIONS.UPDATED,
    note: `Updated fields: ${changedFields.join(', ')}`,
  });

  return updatedTask as ITask;
};

export const assignTask = async (
  taskId: string,
  assignedTo: string,
  actorId: string
): Promise<ITask> => {
  const existingTask = await getTaskById(taskId);

  const isReassignment = Boolean(existingTask.assignedTo);
  const action = isReassignment ? TASK_ACTIONS.REASSIGNED : TASK_ACTIONS.ASSIGNED;

  const [updatedTask] = await db
    .update(tasks)
    .set({
      assignedTo,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))
    .returning();

  if (!updatedTask) {
    throw createAppError('Failed to assign task', 500);
  }

  await recordTaskHistory({
    taskId: updatedTask.id,
    actorId,
    action,
    fromValue: existingTask.assignedTo ?? undefined,
    toValue: assignedTo,
  });

  return updatedTask as ITask;
};

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus,
  actorId: string
): Promise<ITask> => {
  const existingTask = await getTaskById(taskId);

  const [updatedTask] = await db
    .update(tasks)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))
    .returning();

  if (!updatedTask) {
    throw createAppError('Failed to update task status', 500);
  }

  await recordTaskHistory({
    taskId: updatedTask.id,
    actorId,
    action: TASK_ACTIONS.STATUS_CHANGED,
    fromValue: existingTask.status,
    toValue: status,
  });

  return updatedTask as ITask;
};

export const softDeleteTask = async (taskId: string, actorId: string): Promise<void> => {
  const existingTask = await getTaskById(taskId);

  await db
    .update(tasks)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, existingTask.id));

  await recordTaskHistory({
    taskId: existingTask.id,
    actorId,
    action: TASK_ACTIONS.SOFT_DELETED,
  });
};
