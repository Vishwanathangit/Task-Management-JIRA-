import { TaskAction } from '../constants/taskAction';

export interface ITaskHistory {
  id: string;
  taskId: string;
  actorId: string;
  action: TaskAction;
  fromValue: string | null;
  toValue: string | null;
  note: string | null;
  createdAt: Date;
}
