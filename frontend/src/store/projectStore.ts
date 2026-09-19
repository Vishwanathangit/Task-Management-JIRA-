import { create } from 'zustand';

import type { IProject } from '@/types/project.types';

interface ProjectState {
  projects: IProject[];
  currentProject: IProject | null;
  isLoading: boolean;
  setProjects: (projects: IProject[]) => void;
  setCurrentProject: (project: IProject | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (currentProject) => set({ currentProject }),
}));
