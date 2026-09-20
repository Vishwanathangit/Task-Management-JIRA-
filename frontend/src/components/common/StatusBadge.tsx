import * as React from 'react';

import type { TaskStatus } from '@/constants/taskStatus';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: TaskStatus | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  TODO: 'bg-secondary text-secondary-foreground border-border',
  IN_PROGRESS: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  COMPLETED: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30',
  STAGING: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
  PRODUCTION: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  CLOSED: 'bg-muted text-muted-foreground border-border',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const badgeStyle = statusStyles[status] || 'bg-muted text-muted-foreground border-border';
  const displayLabel = status.replace(/_/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        badgeStyle,
        className
      )}
    >
      {displayLabel}
    </span>
  );
};
