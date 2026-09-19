import { asc, eq } from 'drizzle-orm';

import { getTaskById } from './task.service';
import { db } from '../config/db';
import { comments } from '../models/comment.model';
import { taskHistory } from '../models/taskHistory.model';
import { users } from '../models/user.model';

export interface ITaskHistoryItem {
  id: string;
  taskId: string;
  actorId: string;
  actorName: string;
  action: string;
  fromValue: string | null;
  toValue: string | null;
  note: string | null;
  createdAt: Date;
}

export interface ITimelineItem {
  id: string;
  type: 'HISTORY' | 'COMMENT';
  actorId: string;
  actorName: string;
  action?: string;
  fromValue?: string | null;
  toValue?: string | null;
  note?: string | null;
  message?: string;
  createdAt: Date;
}

export const getHistoryForTask = async (taskId: string): Promise<ITaskHistoryItem[]> => {
  await getTaskById(taskId);

  const results = await db
    .select({
      id: taskHistory.id,
      taskId: taskHistory.taskId,
      actorId: taskHistory.actorId,
      actorName: users.name,
      action: taskHistory.action,
      fromValue: taskHistory.fromValue,
      toValue: taskHistory.toValue,
      note: taskHistory.note,
      createdAt: taskHistory.createdAt,
    })
    .from(taskHistory)
    .innerJoin(users, eq(taskHistory.actorId, users.id))
    .where(eq(taskHistory.taskId, taskId))
    .orderBy(asc(taskHistory.createdAt));

  return results;
};

export const getTaskTimeline = async (taskId: string): Promise<ITimelineItem[]> => {
  const historyItems = await getHistoryForTask(taskId);

  const commentResults = await db
    .select({
      id: comments.id,
      actorId: comments.authorId,
      actorName: users.name,
      message: comments.message,
      createdAt: comments.createdAt,
    })
    .from(comments)
    .innerJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.taskId, taskId))
    .orderBy(asc(comments.createdAt));

  const historyTimelineItems: ITimelineItem[] = historyItems.map((item) => ({
    id: item.id,
    type: 'HISTORY',
    actorId: item.actorId,
    actorName: item.actorName,
    action: item.action,
    fromValue: item.fromValue,
    toValue: item.toValue,
    note: item.note,
    createdAt: item.createdAt,
  }));

  const commentTimelineItems: ITimelineItem[] = commentResults.map((item) => ({
    id: item.id,
    type: 'COMMENT',
    actorId: item.actorId,
    actorName: item.actorName,
    message: item.message,
    createdAt: item.createdAt,
  }));

  const combined = [...historyTimelineItems, ...commentTimelineItems];
  combined.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return combined;
};
