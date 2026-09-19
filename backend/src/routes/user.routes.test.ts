import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import app from '../app';
import { ROLES } from '../constants/roles';
import * as userService from '../services/user.service';
import { createAppError } from '../utils/AppError';
import { generateToken } from '../utils/jwt';

describe('User Router Integration Tests (/api/v1/user)', (): void => {
  const token = generateToken({ userId: 'user-uuid-123', role: ROLES.DEVELOPER });

  const sampleUsers = [
    {
      id: 'user-uuid-1',
      name: 'Arjun Mehta',
      email: 'sm@example.com',
      role: ROLES.SCRUM_MASTER,
    },
    {
      id: 'user-uuid-2',
      name: 'Priya Sharma',
      email: 'pm@example.com',
      role: ROLES.PM,
    },
  ];

  describe('GET /api/v1/user', (): void => {
    it('should reject unauthenticated request with 401', async (): Promise<void> => {
      const response = await request(app).get('/api/v1/user');
      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });

    it('should return list of users without passwordHash when authenticated', async (): Promise<void> => {
      vi.spyOn(userService, 'getAllUsers').mockResolvedValueOnce(sampleUsers);

      const response = await request(app)
        .get('/api/v1/user')
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.users).toHaveLength(2);
      expect(response.body.data.users[0].passwordHash).toBeUndefined();
      expect(response.body.data.users[0].name).toBe('Arjun Mehta');
    });
  });

  describe('GET /api/v1/user/:id', (): void => {
    it('should return single user details by id', async (): Promise<void> => {
      vi.spyOn(userService, 'getUserById').mockResolvedValueOnce(sampleUsers[1]);

      const response = await request(app)
        .get(`/api/v1/user/${sampleUsers[1].id}`)
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.id).toBe(sampleUsers[1].id);
      expect(response.body.data.user.passwordHash).toBeUndefined();
    });

    it('should return 404 for non-existent user id', async (): Promise<void> => {
      vi.spyOn(userService, 'getUserById').mockRejectedValueOnce(
        createAppError('User not found', 404)
      );

      const response = await request(app)
        .get('/api/v1/user/non-existent-uuid')
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('User not found');
    });
  });
});
