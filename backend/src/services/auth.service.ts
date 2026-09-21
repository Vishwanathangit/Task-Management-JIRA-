import { and, eq, isNull } from 'drizzle-orm';

import { db } from '../config/db';
import { Role } from '../constants/roles';
import { users } from '../models/user.model';
import { IUserResponse } from '../types/user.types';
import { createAppError } from '../utils/AppError';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { generateToken } from '../utils/jwt';
import { ILoginInput, ISignupInput } from '../validators/user.validator';

export const signup = async (
  input: ISignupInput
): Promise<{ user: IUserResponse; token: string }> => {
  const existingUsers = await db.select().from(users).where(eq(users.email, input.email));
  if (existingUsers.length > 0) {
    throw createAppError('Email is already in use', 409);
  }

  const passwordHash = await hashPassword(input.password);

  const [newUser] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    })
    .returning();

  if (!newUser) {
    throw createAppError('Failed to create user', 500);
  }

  const role = newUser.role as Role;
  const token = generateToken({ userId: newUser.id, role });

  const userResponse: IUserResponse = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role,
    createdAt: newUser.createdAt,
  };

  return { user: userResponse, token };
};

export const login = async (
  input: ILoginInput
): Promise<{ user: IUserResponse; token: string }> => {
  const matchingUsers = await db
    .select()
    .from(users)
    .where(and(eq(users.email, input.email), isNull(users.deletedAt)));

  const user = matchingUsers[0];
  if (!user) {
    throw createAppError('Invalid email or password', 401);
  }

  const isPasswordValid = await comparePassword(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw createAppError('Invalid email or password', 401);
  }

  const role = user.role as Role;
  const token = generateToken({ userId: user.id, role });

  const userResponse: IUserResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    createdAt: user.createdAt,
  };

  return { user: userResponse, token };
};

export const getCurrentUser = async (userId: string): Promise<IUserResponse> => {
  const matchingUsers = await db
    .select()
    .from(users)
    .where(and(eq(users.id, userId), isNull(users.deletedAt)));

  const user = matchingUsers[0];
  if (!user) {
    throw createAppError('User not found', 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    createdAt: user.createdAt,
  };
};
