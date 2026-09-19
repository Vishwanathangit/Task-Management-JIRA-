import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tasks } from './task.model';
import { users } from './user.model';

export const taskHistory = pgTable('task_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id')
    .references(() => tasks.id)
    .notNull(),
  actorId: uuid('actor_id')
    .references(() => users.id)
    .notNull(),
  action: text('action').notNull(),
  fromValue: text('from_value'),
  toValue: text('to_value'),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
