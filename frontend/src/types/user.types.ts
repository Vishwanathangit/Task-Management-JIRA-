import type { Role } from '@/constants/roles';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt?: string;
}

export interface ISignupInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}
