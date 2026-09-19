import { FolderPlus, FolderKanban } from 'lucide-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateProjectDialog } from '@/components/common/CreateProjectDialog';
import { PageLoader } from '@/components/common/PageLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ROLES } from '@/constants/roles';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, fetchProjects, isLoading } = useProjectStore();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  React.useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const isPm = user?.role === ROLES.PM;

  if (isLoading && projects.length === 0) {
    return <PageLoader label="Loading projects..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of active projects ({projects.length} total)
          </p>
        </div>
        {isPm && (
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Create Project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-semibold text-foreground">No projects yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {isPm
              ? 'Get started by creating your first project to track tasks and collaborate with your team.'
              : 'There are no active projects to display right now.'}
          </p>
          {isPm && (
            <Button onClick={() => setIsCreateOpen(true)} variant="outline" className="mt-4 gap-2">
              <FolderPlus className="h-4 w-4" />
              Create Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col justify-between transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  View Tasks
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isPm && (
        <CreateProjectDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
};
