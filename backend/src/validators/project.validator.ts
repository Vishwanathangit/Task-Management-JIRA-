import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().optional(),
});

export const updateProjectSchema = z
  .object({
    name: z.string().min(2, 'Project name must be at least 2 characters').optional(),
    description: z.string().optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: 'At least one field (name or description) must be provided for update',
  });

export type IProjectInput = z.infer<typeof createProjectSchema>;
export type IUpdateProjectInput = z.infer<typeof updateProjectSchema>;
