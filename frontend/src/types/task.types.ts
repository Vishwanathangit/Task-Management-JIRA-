import type { TaskStatus } from '@/constants/taskStatus';

export interface ITask {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  createdBy: string;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ITaskInput {
  projectId: string;
  title: string;
  description?: string;
  assignedTo?: string;
}

export interface IUpdateTaskInput {
  title?: string;
  description?: string;
}

export interface IUpdateTaskStatusInput {
  status: TaskStatus;
}

export interface IAssignTaskInput {
  assignedTo: string;
}

export interface ITaskHistory {
  id: string;
  taskId: string;
  actorId: string;
  action: string;
  fromValue?: string | null;
  toValue?: string | null;
  note?: string | null;
  createdAt: string;
}
