import { and, eq, gte, ilike, isNull, lte } from 'drizzle-orm';

import { db } from '../config/db';
import { projects } from '../models/project.model';
import { IProject, IProjectInput, IUpdateProjectInput } from '../types/project.types';
import { createAppError } from '../utils/AppError';

export interface IProjectPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const createProject = async (
  input: IProjectInput,
  creatorId: string
): Promise<IProject> => {
  const [newProject] = await db
    .insert(projects)
    .values({
      name: input.name,
      description: input.description ?? null,
      createdBy: creatorId,
    })
    .returning();

  if (!newProject) {
    throw createAppError('Failed to create project', 500);
  }

  return newProject;
};

export const getAllProjects = async (params?: {
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}): Promise<{ projects: IProject[]; pagination: IProjectPagination }> => {
  const page = Math.max(1, Number(params?.page) || 1);
  const limit = Math.max(1, Number(params?.limit) || 10);
  const offset = (page - 1) * limit;

  const conditions = [isNull(projects.deletedAt)];
  if (params?.search) {
    conditions.push(ilike(projects.name, `%${params.search}%`));
  }
  if (params?.fromDate) {
    conditions.push(gte(projects.createdAt, new Date(params.fromDate)));
  }
  if (params?.toDate) {
    const end = params.toDate.includes('T')
      ? new Date(params.toDate)
      : new Date(`${params.toDate}T23:59:59.999Z`);
    conditions.push(lte(projects.createdAt, end));
  }

  const allFiltered = await db
    .select()
    .from(projects)
    .where(and(...conditions));

  const total = allFiltered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedProjects = allFiltered.slice(offset, offset + limit);

  return {
    projects: paginatedProjects,
    pagination: { page, limit, total, totalPages },
  };
};

export const getProjectById = async (id: string): Promise<IProject> => {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), isNull(projects.deletedAt)));

  if (!project) {
    throw createAppError('Project not found', 404);
  }

  return project;
};

export const updateProject = async (
  id: string,
  input: IUpdateProjectInput,
  _actorId: string
): Promise<IProject> => {
  const existingProject = await getProjectById(id);

  const updateData: Partial<typeof projects.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) {
    updateData.name = input.name;
  }
  if (input.description !== undefined) {
    updateData.description = input.description;
  }

  const [updatedProject] = await db
    .update(projects)
    .set(updateData)
    .where(eq(projects.id, existingProject.id))
    .returning();

  if (!updatedProject) {
    throw createAppError('Failed to update project', 500);
  }

  return updatedProject;
};

export const softDeleteProject = async (id: string): Promise<void> => {
  const project = await getProjectById(id);

  await db
    .update(projects)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(projects.id, project.id));
};
