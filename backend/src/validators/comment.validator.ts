import { z } from 'zod';

export const addCommentSchema = z.object({
  message: z
    .string()
    .min(1, 'Comment message cannot be empty')
    .max(1000, 'Comment message cannot exceed 1000 characters'),
});

export type IAddCommentInput = z.infer<typeof addCommentSchema>;
