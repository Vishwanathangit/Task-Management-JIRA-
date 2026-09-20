export const ROLES = {
  PM: 'PM',
  SCRUM_MASTER: 'SCRUM_MASTER',
  DEVELOPER: 'DEVELOPER',
  TESTER: 'TESTER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
