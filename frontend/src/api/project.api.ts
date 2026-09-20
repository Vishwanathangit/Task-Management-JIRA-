import axiosInstance from './axiosInstance';
import type {
  IPaginationMeta,
  IProject,
  IProjectFilterParams,
  IProjectInput,
  IUpdateProjectInput,
} from '@/types/project.types';

export interface IGetProjectsResponse {
  projects: IProject[];
  pagination: IPaginationMeta;
}

export const getProjects = async (params?: IProjectFilterParams): Promise<IGetProjectsResponse> => {
  const response = await axiosInstance.get('/project', { params });
  const data = response.data?.data;
  if (Array.isArray(data)) {
    return {
      projects: data,
      pagination: { page: 1, limit: data.length || 10, total: data.length, totalPages: 1 },
    };
  }
  return {
    projects: data?.projects || [],
    pagination: data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
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
