import { and, eq, isNull } from 'drizzle-orm';

import { db } from '../config/db';
import { projects } from '../models/project.model';
import { IProject, IProjectInput, IUpdateProjectInput } from '../types/project.types';
import { createAppError } from '../utils/AppError';

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

export const getAllProjects = async (): Promise<IProject[]> => {
  return db.select().from(projects).where(isNull(projects.deletedAt));
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
