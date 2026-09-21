import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import app from '../app';
import { ROLES } from '../constants/roles';
import * as authService from '../services/auth.service';
import { createAppError } from '../utils/AppError';
import { generateToken } from '../utils/jwt';

describe('Auth Router Integration Tests (/api/v1/auth)', (): void => {
  const sampleUser = {
    id: 'user-uuid-123',
    name: 'Test User',
    email: 'test@example.com',
    role: ROLES.DEVELOPER,
    createdAt: new Date(),
  };

  describe('POST /api/v1/auth/signup', (): void => {
    it('should successfully signup a new user, set token cookie and return 201', async (): Promise<void> => {
      vi.spyOn(authService, 'signup').mockResolvedValueOnce({
        user: sampleUser,
        token: 'mocked.jwt.token',
      });

      const response = await request(app).post('/api/v1/auth/signup').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        role: ROLES.DEVELOPER,
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe(sampleUser.email);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject signup with duplicate email and return 409', async (): Promise<void> => {
      vi.spyOn(authService, 'signup').mockRejectedValueOnce(
        createAppError('Email is already in use', 409)
      );

      const response = await request(app).post('/api/v1/auth/signup').send({
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'Password123',
        role: ROLES.DEVELOPER,
      });

      expect(response.status).toBe(409);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Email is already in use');
    });

    it('should reject invalid payload with 400 validation error', async (): Promise<void> => {
      const response = await request(app).post('/api/v1/auth/signup').send({
        name: 'A',
        email: 'invalid-email',
        password: '123',
        role: 'INVALID_ROLE',
      });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/v1/auth/login', (): void => {
    it('should successfully login user and set token cookie returning 200', async (): Promise<void> => {
      vi.spyOn(authService, 'login').mockResolvedValueOnce({
        user: sampleUser,
        token: 'mocked.jwt.token',
      });

      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe(sampleUser.email);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject invalid password and return 401', async (): Promise<void> => {
      vi.spyOn(authService, 'login').mockRejectedValueOnce(
        createAppError('Invalid email or password', 401)
      );

      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'WrongPassword123',
      });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('POST /api/v1/auth/logout', (): void => {
    it('should require authentication token for logout and return 401 when token missing', async (): Promise<void> => {
      const response = await request(app).post('/api/v1/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });

    it('should clear token cookie and return 200 when valid token provided', async (): Promise<void> => {
      const validToken = generateToken({
        userId: sampleUser.id,
        role: sampleUser.role,
      });

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', [`token=${validToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Logged out successfully');
    });
  });
});
