import { asc, eq } from 'drizzle-orm';

import { getTaskById } from './task.service';
import { db } from '../config/db';
import { TASK_ACTIONS } from '../constants/taskAction';
import { comments } from '../models/comment.model';
import { IComment } from '../types/comment.types';
import { createAppError } from '../utils/AppError';
import { recordTaskHistory } from '../utils/recordTaskHistory';

export const addComment = async (
  taskId: string,
  authorId: string,
  message: string
): Promise<IComment> => {
  await getTaskById(taskId);

  const [newComment] = await db
    .insert(comments)
    .values({
      taskId,
      authorId,
      message,
    })
    .returning();

  if (!newComment) {
    throw createAppError('Failed to add comment', 500);
  }

  const preview = message.length > 100 ? `${message.slice(0, 97)}...` : message;
  await recordTaskHistory({
    taskId,
    actorId: authorId,
    action: TASK_ACTIONS.COMMENT_ADDED,
    note: preview,
  });

  return newComment as IComment;
};

export const getCommentsForTask = async (taskId: string): Promise<IComment[]> => {
  await getTaskById(taskId);

  const taskComments = await db
    .select()
    .from(comments)
    .where(eq(comments.taskId, taskId))
    .orderBy(asc(comments.createdAt));

  return taskComments as IComment[];
};
