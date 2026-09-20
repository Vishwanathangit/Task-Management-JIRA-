import axiosInstance from './axiosInstance';
import type { IUserResponse } from '@/types/user.types';

export const getAllUsers = async (): Promise<IUserResponse[]> => {
  const response = await axiosInstance.get('/user');
  return response.data.data.users || response.data.data || [];
};

export const getUserById = async (id: string): Promise<IUserResponse> => {
  const response = await axiosInstance.get(`/user/${id}`);
  return response.data.data.user || response.data.data;
};
