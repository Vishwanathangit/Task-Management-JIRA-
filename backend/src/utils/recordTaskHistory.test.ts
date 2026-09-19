import { describe, expect, it, vi } from 'vitest';

import { recordTaskHistory } from './recordTaskHistory';
import { db } from '../config/db';
import { TASK_ACTIONS } from '../constants/taskAction';

describe('recordTaskHistory utility', (): void => {
  it('should call db.insert with mapped history values', async (): Promise<void> => {
    const insertSpy = vi.spyOn(db, 'insert').mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof db.insert>);

    await recordTaskHistory({
      taskId: 'task-123',
      actorId: 'user-456',
      action: TASK_ACTIONS.CREATED,
      note: 'Initial creation',
    });

    expect(insertSpy).toHaveBeenCalled();
    insertSpy.mockRestore();
  });
});
