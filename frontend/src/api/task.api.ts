import axiosInstance from './axiosInstance';
import type {
  IAssignTaskInput,
  ITask,
  ITaskHistory,
  ITaskInput,
  IUpdateTaskInput,
  IUpdateTaskStatusInput,
} from '@/types/task.types';

export const getTasks = async (projectId?: string): Promise<ITask[]> => {
  const url = projectId ? `/task?projectId=${projectId}` : '/task';
  const response = await axiosInstance.get(url);
  return response.data.data;
};

export const getTaskById = async (id: string): Promise<ITask> => {
  const response = await axiosInstance.get(`/task/${id}`);
  return response.data.data;
};

export const createTask = async (data: ITaskInput): Promise<ITask> => {
  const response = await axiosInstance.post('/task', data);
  return response.data.data;
};

export const updateTask = async (id: string, data: IUpdateTaskInput): Promise<ITask> => {
  const response = await axiosInstance.patch(`/task/${id}`, data);
  return response.data.data;
};

export const updateTaskStatus = async (
  id: string,
  data: IUpdateTaskStatusInput
): Promise<ITask> => {
  const response = await axiosInstance.patch(`/task/${id}/status`, data);
  return response.data.data;
};

export const assignTask = async (id: string, data: IAssignTaskInput): Promise<ITask> => {
  const response = await axiosInstance.patch(`/task/${id}/assign`, data);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/task/${id}`);
};

export const getTaskTimeline = async (id: string): Promise<ITaskHistory[]> => {
  const response = await axiosInstance.get(`/task/${id}/timeline`);
  return response.data.data;
};
