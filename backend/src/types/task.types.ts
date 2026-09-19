import { TaskStatus } from '../constants/taskStatus';
import {
  IAssignTaskInput,
  ITaskInput,
  IUpdateStatusInput,
  IUpdateTaskInput,
} from '../validators/task.validator';

export { IAssignTaskInput, ITaskInput, IUpdateStatusInput, IUpdateTaskInput };

export interface ITask {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdBy: string;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
