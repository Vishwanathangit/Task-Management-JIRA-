import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import app from '../app';
import { ROLES } from '../constants/roles';
import { TASK_STATUS } from '../constants/taskStatus';
import * as taskService from '../services/task.service';
import { generateToken } from '../utils/jwt';

describe('Task Router Integration Tests (/api/v1/task)', (): void => {
  const pmToken = generateToken({ userId: '123e4567-e89b-12d3-a456-426614174001', role: ROLES.PM });
  const devToken = generateToken({
    userId: '123e4567-e89b-12d3-a456-426614174002',
    role: ROLES.DEVELOPER,
  });

  const sampleTask = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    projectId: '123e4567-e89b-12d3-a456-426614174099',
    title: 'Setup Auth Module',
    description: 'Build user auth',
    status: TASK_STATUS.TODO,
    createdBy: '123e4567-e89b-12d3-a456-426614174001',
    assignedTo: '123e4567-e89b-12d3-a456-426614174002',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  describe('POST /api/v1/task', (): void => {
    it('should allow PM to create task and return 201', async (): Promise<void> => {
      vi.spyOn(taskService, 'createTask').mockResolvedValueOnce(sampleTask);

      const response = await request(app)
        .post('/api/v1/task')
        .set('Cookie', [`token=${pmToken}`])
        .send({
          projectId: '123e4567-e89b-12d3-a456-426614174099',
          title: 'Setup Auth Module',
          description: 'Build user auth',
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.task.title).toBe('Setup Auth Module');
    });
  });

  describe('PATCH /api/v1/task/:id', (): void => {
    it('should allow authenticated user to update title and return 200', async (): Promise<void> => {
      const updatedTask = { ...sampleTask, title: 'Updated Auth Module Title' };
      vi.spyOn(taskService, 'updateTask').mockResolvedValueOnce(updatedTask);

      const response = await request(app)
        .patch(`/api/v1/task/${sampleTask.id}`)
        .set('Cookie', [`token=${devToken}`])
        .send({ title: 'Updated Auth Module Title' });

      expect(response.status).toBe(200);
      expect(response.body.data.task.title).toBe('Updated Auth Module Title');
    });

    it('should reject update with empty payload and return 400', async (): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/task/${sampleTask.id}`)
        .set('Cookie', [`token=${devToken}`])
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('PATCH /api/v1/task/:id/status', (): void => {
    it('should allow any authenticated user to update any task status to COMPLETED', async (): Promise<void> => {
      const updatedTask = { ...sampleTask, status: TASK_STATUS.COMPLETED };
      vi.spyOn(taskService, 'updateTaskStatus').mockResolvedValueOnce(updatedTask);

      const response = await request(app)
        .patch(`/api/v1/task/${sampleTask.id}/status`)
        .set('Cookie', [`token=${devToken}`])
        .send({ status: TASK_STATUS.COMPLETED });

      expect(response.status).toBe(200);
      expect(response.body.data.task.status).toBe(TASK_STATUS.COMPLETED);
    });

    it('should allow updating task status to STAGING, PRODUCTION, or CLOSED', async (): Promise<void> => {
      const updatedTask = { ...sampleTask, status: TASK_STATUS.PRODUCTION };
      vi.spyOn(taskService, 'updateTaskStatus').mockResolvedValueOnce(updatedTask);

      const response = await request(app)
        .patch(`/api/v1/task/${sampleTask.id}/status`)
        .set('Cookie', [`token=${devToken}`])
        .send({ status: TASK_STATUS.PRODUCTION });

      expect(response.status).toBe(200);
      expect(response.body.data.task.status).toBe(TASK_STATUS.PRODUCTION);
    });
  });
});
