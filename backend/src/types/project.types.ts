import { IProjectInput, IUpdateProjectInput } from '../validators/project.validator';

export { IProjectInput, IUpdateProjectInput };

export interface IProject {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
