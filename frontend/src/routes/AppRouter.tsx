import * as React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/login/LoginPage';
import { ProjectPage } from '@/pages/project/ProjectPage';
import { ProjectsPage } from '@/pages/project/ProjectsPage';
import { SignupPage } from '@/pages/signup/SignupPage';
import { TaskDetailPage } from '@/pages/task/TaskDetailPage';
import { TaskPage } from '@/pages/task/TaskPage';

import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/projects" replace />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'projects',
            element: <ProjectsPage />,
          },
          {
            path: 'projects/:id',
            element: <ProjectPage />,
          },
          {
            path: 'projects/:projectId/tasks/:taskId',
            element: <TaskDetailPage />,
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
    element: <Navigate to="/projects" replace />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
