import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tasks } from './task.model';
import { users } from './user.model';

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id')
    .references(() => tasks.id)
    .notNull(),
  authorId: uuid('author_id')
    .references(() => users.id)
    .notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
