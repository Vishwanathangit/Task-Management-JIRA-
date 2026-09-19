import { describe, expect, it } from 'vitest';

import { createAppError, isAppError } from './AppError';

describe('AppError functional utility', (): void => {
  it('should create an error with a message and status code', (): void => {
    const err = createAppError('Not Found', 404);
    expect(err.message).toBe('Not Found');
    expect(err.statusCode).toBe(404);
    expect(err).toBeInstanceOf(Error);
  });

  it('should identify valid AppError instances with isAppError', (): void => {
    const appErr = createAppError('Unauthorized', 401);
    const standardErr = new Error('Generic Error');

    expect(isAppError(appErr)).toBe(true);
    expect(isAppError(standardErr)).toBe(false);
    expect(isAppError('string error')).toBe(false);
    expect(isAppError(null)).toBe(false);
  });
});
