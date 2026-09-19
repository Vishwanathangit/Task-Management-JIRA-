import { z } from 'zod';

import { ROLES } from '../constants/roles';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
  role: z.enum([ROLES.PM, ROLES.SCRUM_MASTER, ROLES.DEVELOPER, ROLES.TESTER]),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type ISignupInput = z.infer<typeof signupSchema>;
export type ILoginInput = z.infer<typeof loginSchema>;
