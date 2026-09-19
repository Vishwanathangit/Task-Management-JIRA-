import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../app';

describe('GET /api/v1/health', (): void => {
  it('should return 200 with status ok', async (): Promise<void> => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
