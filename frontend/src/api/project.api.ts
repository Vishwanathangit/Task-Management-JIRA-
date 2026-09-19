import axiosInstance from './axiosInstance';
import type { IProject, IProjectInput, IUpdateProjectInput } from '@/types/project.types';

export const getProjects = async (): Promise<IProject[]> => {
  const response = await axiosInstance.get('/project');
  return response.data.data.projects || response.data.data || [];
};

export const getProjectById = async (id: string): Promise<IProject> => {
  const response = await axiosInstance.get(`/project/${id}`);
  return response.data.data.project || response.data.data;
};

export const createProject = async (data: IProjectInput): Promise<IProject> => {
  const response = await axiosInstance.post('/project', data);
  return response.data.data.project || response.data.data;
};

export const updateProject = async (id: string, data: IUpdateProjectInput): Promise<IProject> => {
  const response = await axiosInstance.patch(`/project/${id}`, data);
  return response.data.data.project || response.data.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/project/${id}`);
};
