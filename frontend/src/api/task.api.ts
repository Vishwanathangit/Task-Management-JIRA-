import axiosInstance from './axiosInstance';
import type { IPaginationMeta } from '@/types/project.types';
import type {
  IAssignTaskInput,
  ITask,
  ITaskFilterParams,
  ITaskInput,
  ITimelineItem,
  IUpdateTaskInput,
  IUpdateTaskStatusInput,
} from '@/types/task.types';

export interface IGetTasksResponse {
  tasks: ITask[];
  pagination: IPaginationMeta;
}

export const getTasks = async (params?: ITaskFilterParams): Promise<IGetTasksResponse> => {
  const response = await axiosInstance.get('/task', { params });
  const data = response.data?.data;
  if (Array.isArray(data)) {
    return {
      tasks: data,
      pagination: { page: 1, limit: data.length || 10, total: data.length, totalPages: 1 },
    };
  }
  return {
    tasks: data?.tasks || [],
    pagination: data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
};

export const getTaskById = async (id: string): Promise<ITask> => {
  const response = await axiosInstance.get(`/task/${id}`);
  return response.data.data.task || response.data.data;
};

export const createTask = async (data: ITaskInput): Promise<ITask> => {
  const response = await axiosInstance.post('/task', data);
  return response.data.data.task || response.data.data;
};

export const updateTask = async (id: string, data: IUpdateTaskInput): Promise<ITask> => {
  const response = await axiosInstance.patch(`/task/${id}`, data);
  return response.data.data.task || response.data.data;
};

export const updateTaskStatus = async (
  id: string,
  data: IUpdateTaskStatusInput
): Promise<ITask> => {
  const response = await axiosInstance.patch(`/task/${id}/status`, data);
  return response.data.data.task || response.data.data;
};

export const assignTask = async (id: string, data: IAssignTaskInput): Promise<ITask> => {
  const response = await axiosInstance.patch(`/task/${id}/assign`, data);
  return response.data.data.task || response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/task/${id}`);
};

export const getTaskTimeline = async (id: string): Promise<ITimelineItem[]> => {
  const response = await axiosInstance.get(`/task/${id}/timeline`);
  return response.data.data.timeline || response.data.data.history || response.data.data || [];
};
