import { Role } from '../constants/roles';
import { ILoginInput, ISignupInput } from '../validators/user.validator';

export { ILoginInput, ISignupInput };

export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}
