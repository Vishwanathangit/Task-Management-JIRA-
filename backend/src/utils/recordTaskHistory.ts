import { db } from '../config/db';
import { TaskAction } from '../constants/taskAction';
import { taskHistory } from '../models/taskHistory.model';

export interface RecordTaskHistoryParams {
  taskId: string;
  actorId: string;
  action: TaskAction;
  fromValue?: string;
  toValue?: string;
  note?: string;
}

export const recordTaskHistory = async (params: RecordTaskHistoryParams): Promise<void> => {
  await db.insert(taskHistory).values({
    taskId: params.taskId,
    actorId: params.actorId,
    action: params.action,
    fromValue: params.fromValue ?? null,
    toValue: params.toValue ?? null,
    note: params.note ?? null,
  });
};
