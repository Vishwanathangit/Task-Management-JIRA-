import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import app from '../app';
import { ROLES } from '../constants/roles';
import * as projectService from '../services/project.service';
import { generateToken } from '../utils/jwt';

describe('Project Router Integration Tests (/api/v1/project)', (): void => {
  const pmToken = generateToken({ userId: 'pm-uuid-123', role: ROLES.PM });
  const devToken = generateToken({ userId: 'dev-uuid-456', role: ROLES.DEVELOPER });

  const sampleProject = {
    id: 'project-uuid-1',
    name: 'Task Manager App',
    description: 'Main project',
    createdBy: 'pm-uuid-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  describe('POST /api/v1/project', (): void => {
    it('should allow PM to create a project and return 201', async (): Promise<void> => {
      vi.spyOn(projectService, 'createProject').mockResolvedValueOnce(sampleProject);

      const response = await request(app)
        .post('/api/v1/project')
        .set('Cookie', [`token=${pmToken}`])
        .send({ name: 'Task Manager App', description: 'Main project' });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.project.name).toBe('Task Manager App');
    });

    it('should reject non-PM user with 403 Forbidden', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/project')
        .set('Cookie', [`token=${devToken}`])
        .send({ name: 'Dev Project' });

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('error');
    });
  });

  describe('PATCH /api/v1/project/:id', (): void => {
    it('should allow PM to update project details and return 200', async (): Promise<void> => {
      const updatedProject = { ...sampleProject, name: 'Updated App Name' };
      vi.spyOn(projectService, 'updateProject').mockResolvedValueOnce(updatedProject);

      const response = await request(app)
        .patch(`/api/v1/project/${sampleProject.id}`)
        .set('Cookie', [`token=${pmToken}`])
        .send({ name: 'Updated App Name' });

      expect(response.status).toBe(200);
      expect(response.body.data.project.name).toBe('Updated App Name');
    });

    it('should reject update with empty payload and return 400 validation error', async (): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/project/${sampleProject.id}`)
        .set('Cookie', [`token=${pmToken}`])
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/v1/project', (): void => {
    it('should return list of projects for authenticated users', async (): Promise<void> => {
      vi.spyOn(projectService, 'getAllProjects').mockResolvedValueOnce({
        projects: [sampleProject],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });

      const response = await request(app)
        .get('/api/v1/project')
        .set('Cookie', [`token=${devToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.projects).toHaveLength(1);
    });

    it('should filter projects by fromDate and toDate', async (): Promise<void> => {
      vi.spyOn(projectService, 'getAllProjects').mockImplementationOnce(async (params) => {
        expect(params?.fromDate).toBe('2026-01-01');
        expect(params?.toDate).toBe('2026-12-31');
        return {
          projects: [sampleProject],
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        };
      });

      const response = await request(app)
        .get('/api/v1/project?fromDate=2026-01-01&toDate=2026-12-31')
        .set('Cookie', [`token=${devToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.projects).toHaveLength(1);
    });
  });
});
