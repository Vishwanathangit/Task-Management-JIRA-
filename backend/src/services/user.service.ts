import { and, asc, eq, isNull } from 'drizzle-orm';

import { db } from '../config/db';
import { users } from '../models/user.model';
import { createAppError } from '../utils/AppError';

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const getAllUsers = async (): Promise<SafeUser[]> => {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(isNull(users.deletedAt))
    .orderBy(asc(users.name));
};

export const getUserById = async (id: string): Promise<SafeUser> => {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
    .limit(1);

  if (result.length === 0) {
    throw createAppError('User not found', 404);
  }

  return result[0];
};
