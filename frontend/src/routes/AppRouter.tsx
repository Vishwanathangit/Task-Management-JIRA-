import * as React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { LoginPage } from '@/pages/login/LoginPage';
import { ProjectPage } from '@/pages/project/ProjectPage';
import { SignupPage } from '@/pages/signup/SignupPage';
import { TaskPage } from '@/pages/task/TaskPage';

import { ProtectedRoute } from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'projects',
            element: <DashboardPage />,
          },
          {
            path: 'projects/:id',
            element: <ProjectPage />,
          },
          {
            path: 'tasks',
            element: <TaskPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
