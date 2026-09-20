import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { PageLoader } from '@/components/common/PageLoader';
import { useAuthStore } from '@/store/authStore';

interface PublicRouteProps {
  children?: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <PageLoader label="Verifying session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
