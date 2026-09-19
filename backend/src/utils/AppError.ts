export interface AppError extends Error {
  statusCode: number;
}

export const createAppError = (message: string, statusCode: number): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
};

export const isAppError = (err: unknown): err is AppError =>
  err instanceof Error && typeof (err as AppError).statusCode === 'number';
