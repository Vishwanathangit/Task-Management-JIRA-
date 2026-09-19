import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import app from '../app';
import { ROLES } from '../constants/roles';
import * as commentService from '../services/comment.service';
import * as taskHistoryService from '../services/taskHistory.service';
import { generateToken } from '../utils/jwt';

describe('Comments & History Integration Tests (/api/v1/task)', (): void => {
  const token = generateToken({
    userId: '123e4567-e89b-12d3-a456-426614174001',
    role: ROLES.DEVELOPER,
  });
  const taskId = '123e4567-e89b-12d3-a456-426614174000';

  describe('POST /api/v1/task/:id/comments', (): void => {
    it('should add a comment and return 201', async (): Promise<void> => {
      const mockComment = {
        id: 'comment-uuid-1',
        taskId,
        authorId: '123e4567-e89b-12d3-a456-426614174001',
        message: 'Fixed issue in staging',
        createdAt: new Date(),
      };

      vi.spyOn(commentService, 'addComment').mockResolvedValueOnce(mockComment);

      const response = await request(app)
        .post(`/api/v1/task/${taskId}/comments`)
        .set('Cookie', [`token=${token}`])
        .send({ message: 'Fixed issue in staging' });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.comment.message).toBe('Fixed issue in staging');
    });
  });

  describe('GET /api/v1/task/:id/timeline', (): void => {
    it('should return merged timeline of history and comments', async (): Promise<void> => {
      const mockTimeline = [
        {
          id: 'hist-1',
          type: 'HISTORY' as const,
          actorId: '123e4567-e89b-12d3-a456-426614174001',
          actorName: 'Jane Doe',
          action: 'CREATED',
          createdAt: new Date('2026-09-19T10:00:00Z'),
        },
        {
          id: 'comm-1',
          type: 'COMMENT' as const,
          actorId: '123e4567-e89b-12d3-a456-426614174001',
          actorName: 'Jane Doe',
          message: 'Fixed issue in staging',
          createdAt: new Date('2026-09-19T10:05:00Z'),
        },
      ];

      vi.spyOn(taskHistoryService, 'getTaskTimeline').mockResolvedValueOnce(mockTimeline);

      const response = await request(app)
        .get(`/api/v1/task/${taskId}/timeline`)
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.timeline).toHaveLength(2);
      expect(response.body.data.timeline[0].type).toBe('HISTORY');
      expect(response.body.data.timeline[1].type).toBe('COMMENT');
    });
  });
});
