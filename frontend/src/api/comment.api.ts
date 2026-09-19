import axiosInstance from './axiosInstance';
import type { IAddCommentInput, IComment } from '@/types/comment.types';

export const getCommentsForTask = async (taskId: string): Promise<IComment[]> => {
  const response = await axiosInstance.get(`/task/${taskId}/comments`);
  return response.data.data.comments || response.data.data || [];
};

export const addComment = async (taskId: string, data: IAddCommentInput): Promise<IComment> => {
  const response = await axiosInstance.post(`/task/${taskId}/comments`, data);
  return response.data.data.comment || response.data.data;
};
