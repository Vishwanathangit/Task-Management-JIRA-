export interface IComment {
  id: string;
  taskId: string;
  authorId: string;
  message: string;
  createdAt: string;
}

export interface IAddCommentInput {
  message: string;
}
