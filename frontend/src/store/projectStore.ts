import { create } from 'zustand';

import {
  createProject as apiCreateProject,
  deleteProject as apiDeleteProject,
  getProjectById as apiGetProjectById,
  getProjects as apiGetProjects,
  updateProject as apiUpdateProject,
} from '@/api/project.api';
import type { IProject, IProjectInput, IUpdateProjectInput } from '@/types/project.types';

interface ProjectState {
  projects: IProject[];
  currentProject: IProject | null;
  isLoading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<IProject | null>;
  createProject: (input: IProjectInput) => Promise<IProject>;
  updateProject: (id: string, input: IUpdateProjectInput) => Promise<IProject>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await apiGetProjects();
      set({ projects, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projects';
      set({ error: message, isLoading: false });
    }
  },

  fetchProjectById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await apiGetProjectById(id);
      set({ currentProject: project, isLoading: false });
      return project;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch project';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  createProject: async (input: IProjectInput) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await apiCreateProject(input);
      set((state) => ({
        projects: [newProject, ...state.projects],
        isLoading: false,
      }));
      return newProject;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create project';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  updateProject: async (id: string, input: IUpdateProjectInput) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await apiUpdateProject(id, input);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updated : p)),
        currentProject: state.currentProject?.id === id ? updated : state.currentProject,
        isLoading: false,
      }));
      return updated;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update project';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      set({ error: message, isLoading: false });
      throw err;
    }
  },
}));
