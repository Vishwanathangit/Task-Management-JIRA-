import { eq } from 'drizzle-orm';

import { db } from '../config/db';
import { ROLES } from '../constants/roles';
import { TASK_ACTIONS } from '../constants/taskAction';
import { TASK_STATUS } from '../constants/taskStatus';
import { comments } from '../models/comment.model';
import { projects } from '../models/project.model';
import { tasks } from '../models/task.model';
import { users } from '../models/user.model';
import { hashPassword } from '../utils/hashPassword';
import { recordTaskHistory } from '../utils/recordTaskHistory';

const seed = async (): Promise<void> => {
  try {
    const existingPm = await db
      .select()
      .from(users)
      .where(eq(users.email, 'pm@example.com'))
      .limit(1);

    if (existingPm.length > 0) {
      console.log('Database already seeded, skipping.');
      process.exit(0);
    }

    const commonPasswordHash = await hashPassword('Password123');

    const insertedUsers = await db
      .insert(users)
      .values([
        {
          name: 'Priya Sharma',
          email: 'pm@example.com',
          passwordHash: commonPasswordHash,
          role: ROLES.PM,
        },
        {
          name: 'Arjun Mehta',
          email: 'sm@example.com',
          passwordHash: commonPasswordHash,
          role: ROLES.SCRUM_MASTER,
        },
        {
          name: 'Dev One',
          email: 'dev1@example.com',
          passwordHash: commonPasswordHash,
          role: ROLES.DEVELOPER,
        },
        {
          name: 'Dev Two',
          email: 'dev2@example.com',
          passwordHash: commonPasswordHash,
          role: ROLES.DEVELOPER,
        },
        {
          name: 'Tester One',
          email: 'tester@example.com',
          passwordHash: commonPasswordHash,
          role: ROLES.TESTER,
        },
      ])
      .returning();

    const pmUser = insertedUsers.find((u) => u.role === ROLES.PM)!;
    const smUser = insertedUsers.find((u) => u.role === ROLES.SCRUM_MASTER)!;
    const devUsers = insertedUsers.filter((u) => u.role === ROLES.DEVELOPER);
    const dev1 = devUsers[0];
    const dev2 = devUsers[1];
    const tester = insertedUsers.find((u) => u.role === ROLES.TESTER)!;

    const insertedProjects = await db
      .insert(projects)
      .values([
        {
          name: 'E-commerce Revamp',
          description: 'Rebuild checkout and cart flow',
          createdBy: pmUser.id,
        },
      ])
      .returning();

    const project = insertedProjects[0];

    const insertedTasks = await db
      .insert(tasks)
      .values([
        {
          projectId: project.id,
          title: 'Setup cart state management',
          description: 'Implement Redux/Zustand store for cart',
          status: TASK_STATUS.TODO,
          createdBy: pmUser.id,
          assignedTo: dev1.id,
        },
        {
          projectId: project.id,
          title: 'Checkout API integration',
          description: 'Connect payment gateway endpoints',
          status: TASK_STATUS.IN_PROGRESS,
          createdBy: smUser.id,
          assignedTo: dev2.id,
        },
        {
          projectId: project.id,
          title: 'Staging environment deployment',
          description: 'Deploy backend build to staging Supabase/server',
          status: TASK_STATUS.STAGING,
          createdBy: pmUser.id,
          assignedTo: dev1.id,
        },
        {
          projectId: project.id,
          title: 'User session timeout fix',
          description: 'Resolve token refresh bug on checkout screen',
          status: TASK_STATUS.CLOSED,
          createdBy: smUser.id,
          assignedTo: dev2.id,
        },
      ])
      .returning();

    for (const task of insertedTasks) {
      await recordTaskHistory({
        taskId: task.id,
        actorId: task.createdBy,
        action: TASK_ACTIONS.CREATED,
      });

      if (task.status !== TASK_STATUS.TODO) {
        await recordTaskHistory({
          taskId: task.id,
          actorId: task.assignedTo || task.createdBy,
          action: TASK_ACTIONS.STATUS_CHANGED,
          fromValue: TASK_STATUS.TODO,
          toValue: task.status,
        });
      }
    }

    const insertedComments = await db
      .insert(comments)
      .values([
        {
          taskId: insertedTasks[2].id,
          authorId: dev1.id,
          message: 'Fixed the auth middleware bug in staging environment.',
        },
        {
          taskId: insertedTasks[3].id,
          authorId: tester.id,
          message: 'Please verify this in staging before closing.',
        },
      ])
      .returning();

    console.log(
      `Seeded ${insertedUsers.length} users, ${insertedProjects.length} project, ${insertedTasks.length} tasks, ${insertedComments.length} comments`
    );
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

void seed();
