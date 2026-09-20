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

export interface ITaskFilterParams {
  search?: string;
  projectId?: string;
  assignedTo?: string;
  status?: TaskStatus;
  page?: number;
  limit?: number;
}

export interface ITaskInput {
  projectId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status?: TaskStatus;
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
  createdAt: string;
}
