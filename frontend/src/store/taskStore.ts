import { create } from 'zustand';

import type { ITask } from '@/types/task.types';

interface TaskState {
  tasks: ITask[];
  currentTask: ITask | null;
  isLoading: boolean;
  setTasks: (tasks: ITask[]) => void;
  setCurrentTask: (task: ITask | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  setTasks: (tasks) => set({ tasks }),
  setCurrentTask: (currentTask) => set({ currentTask }),
}));
