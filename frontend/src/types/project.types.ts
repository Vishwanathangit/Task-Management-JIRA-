export interface IProject {
  id: string;
  name: string;
  description?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface IProjectInput {
  name: string;
  description?: string;
}

export interface IUpdateProjectInput {
  name?: string;
  description?: string;
}
