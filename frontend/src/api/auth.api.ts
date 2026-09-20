import axiosInstance from './axiosInstance';
import type { ILoginInput, ISignupInput, IUserResponse } from '@/types/user.types';

export const signupUser = async (data: ISignupInput): Promise<IUserResponse> => {
  const response = await axiosInstance.post('/auth/signup', data);
  return response.data.data.user || response.data.data;
};

export const loginUser = async (data: ILoginInput): Promise<IUserResponse> => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data.data.user || response.data.data;
};

export const logoutUser = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<IUserResponse> => {
  const response = await axiosInstance.get('/auth/me');
  return response.data.data.user || response.data.data;
};
