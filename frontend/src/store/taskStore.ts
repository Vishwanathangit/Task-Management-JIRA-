import { create } from 'zustand';

import { addComment as apiAddComment } from '@/api/comment.api';
import {
  assignTask as apiAssignTask,
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
  getTaskById as apiGetTaskById,
  getTasks as apiGetTasks,
  getTaskTimeline as apiGetTaskTimeline,
  updateTask as apiUpdateTask,
  updateTaskStatus as apiUpdateTaskStatus,
} from '@/api/task.api';
import type { TaskStatus } from '@/constants/taskStatus';
import type { IPaginationMeta } from '@/types/project.types';
import type {
  ITask,
  ITaskFilterParams,
  ITaskInput,
  ITimelineItem,
  IUpdateTaskInput,
} from '@/types/task.types';

interface TaskState {
  tasks: ITask[];
  pagination: IPaginationMeta;
  currentTask: ITask | null;
  timeline: ITimelineItem[];
  isLoading: boolean;
  error: string | null;

  fetchTasksByProject: (projectId: string) => Promise<void>;
  fetchAllTasks: (params?: ITaskFilterParams) => Promise<void>;
  fetchTaskById: (id: string) => Promise<ITask | null>;
  createTask: (input: ITaskInput) => Promise<ITask>;
  updateTask: (id: string, input: IUpdateTaskInput) => Promise<ITask>;
  assignTask: (id: string, assignedTo: string) => Promise<ITask>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<ITask>;
  deleteTask: (id: string) => Promise<void>;
  fetchTaskTimeline: (id: string) => Promise<void>;
  addComment: (taskId: string, message: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  currentTask: null,
  timeline: [],
  isLoading: false,
  error: null,

  fetchTasksByProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { tasks, pagination } = await apiGetTasks({ projectId });
      set({ tasks, pagination, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      set({ error: message, isLoading: false });
    }
  },

  fetchAllTasks: async (params?: ITaskFilterParams) => {
    set({ isLoading: true, error: null });
    try {
      const { tasks, pagination } = await apiGetTasks(params);
      set({ tasks, pagination, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      set({ error: message, isLoading: false });
    }
  },

  fetchTaskById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const task = await apiGetTaskById(id);
      set({ currentTask: task, isLoading: false });
      return task;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch task';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  createTask: async (input: ITaskInput) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await apiCreateTask(input);
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }));
      return newTask;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  updateTask: async (id: string, input: IUpdateTaskInput) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await apiUpdateTask(id, input);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
        currentTask: state.currentTask?.id === id ? updated : state.currentTask,
        isLoading: false,
      }));
      return updated;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  assignTask: async (id: string, assignedTo: string) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await apiAssignTask(id, { assignedTo });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
        currentTask: state.currentTask?.id === id ? updated : state.currentTask,
        isLoading: false,
      }));
      return updated;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to assign task';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  updateTaskStatus: async (id: string, status: TaskStatus) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await apiUpdateTaskStatus(id, { status });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
        currentTask: state.currentTask?.id === id ? updated : state.currentTask,
        isLoading: false,
      }));
      return updated;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update task status';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        currentTask: state.currentTask?.id === id ? null : state.currentTask,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  fetchTaskTimeline: async (id: string) => {
    try {
      const timeline = await apiGetTaskTimeline(id);
      set({ timeline });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch timeline';
      set({ error: message });
    }
  },

  addComment: async (taskId: string, message: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiAddComment(taskId, { message });
      set({ isLoading: false });
      await get().fetchTaskTimeline(taskId);
    } catch (err: unknown) {
      const messageStr = err instanceof Error ? err.message : 'Failed to add comment';
      set({ error: messageStr, isLoading: false });
      throw err;
    }
  },
}));
