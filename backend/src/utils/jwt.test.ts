import { describe, expect, it } from 'vitest';

import { generateToken, verifyToken } from './jwt';
import { ROLES } from '../constants/roles';

describe('JWT utilities', (): void => {
  it('should generate and verify a valid JWT token', (): void => {
    const payload = { userId: 'user-123', role: ROLES.DEVELOPER };
    const token = generateToken(payload);

    expect(token).toBeDefined();
    const verified = verifyToken(token);
    expect(verified).toEqual(payload);
  });

  it('should return null when verifying a tampered or invalid token', (): void => {
    const invalidToken = 'invalid.jwt.token';
    const result = verifyToken(invalidToken);

    expect(result).toBeNull();
  });
});
