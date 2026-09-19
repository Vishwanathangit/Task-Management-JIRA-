import * as React from 'react';

import { useAuthStore } from '@/store/authStore';

export const Navbar: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-2 font-bold text-foreground">
        <span>Task Management</span>
      </div>
      {user && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{user.name}</span>
          <span className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
            {user.role}
          </span>
        </div>
      )}
    </header>
  );
};
