import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { projects } from './project.model';
import { users } from './user.model';
import { TASK_STATUS } from '../constants/taskStatus';

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .references(() => projects.id)
    .notNull(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default(TASK_STATUS.TODO).notNull(),
  createdBy: uuid('created_by')
    .references(() => users.id)
    .notNull(),
  assignedTo: uuid('assigned_to').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
