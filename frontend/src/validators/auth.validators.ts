import { z } from 'zod';

import { ROLES } from '@/constants/roles';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .regex(emailRegex, 'Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .regex(emailRegex, 'Invalid email address format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(passwordRegex, 'Password must be at least 8 characters and include at least one letter and one number'),
  role: z.enum([ROLES.PM, ROLES.SCRUM_MASTER, ROLES.DEVELOPER, ROLES.TESTER]),
});

export type SignupFormData = z.infer<typeof signupSchema>;
