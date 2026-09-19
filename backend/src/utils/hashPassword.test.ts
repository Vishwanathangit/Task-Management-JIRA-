import { describe, expect, it } from 'vitest';

import { comparePassword, hashPassword } from './hashPassword';

describe('hashPassword & comparePassword', (): void => {
  it('should hash a password and correctly verify valid plain password', async (): Promise<void> => {
    const plain = 'Secret123!';
    const hashed = await hashPassword(plain);

    expect(hashed).not.toBe(plain);
    const isValid = await comparePassword(plain, hashed);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect plain password', async (): Promise<void> => {
    const plain = 'Secret123!';
    const hashed = await hashPassword(plain);

    const isValid = await comparePassword('WrongPassword', hashed);
    expect(isValid).toBe(false);
  });
});
