import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface PageLoaderProps {
  className?: string;
  label?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ className, label = 'Loading...' }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-75 w-full gap-3', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
    </div>
  );
};
