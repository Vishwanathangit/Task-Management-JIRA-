import { ArrowLeft, Edit, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CreateTaskDialog } from '@/components/common/CreateTaskDialog';
import { EditProjectDialog } from '@/components/common/EditProjectDialog';
import { PageLoader } from '@/components/common/PageLoader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROLES } from '@/constants/roles';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import { useTaskStore } from '@/store/taskStore';
import { useUserStore } from '@/store/userStore';

export const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentProject, fetchProjectById, deleteProject, isLoading: isProjectLoading, error } = useProjectStore();
  const { tasks, fetchTasksByProject, isLoading: isTaskLoading } = useTaskStore();
  const { fetchUsers, getUserName } = useUserStore();

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = React.useState(false);

  React.useEffect(() => {
    void fetchUsers();
    if (id) {
      void fetchProjectById(id);
      void fetchTasksByProject(id);
    }
  }, [id, fetchProjectById, fetchTasksByProject, fetchUsers]);

  const isPm = user?.role === ROLES.PM;

  if (isProjectLoading && !currentProject) {
    return <PageLoader label="Loading project details..." />;
  }

  if (error || !currentProject) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-xl font-semibold text-foreground">Project Not Found</h2>
        <p className="text-sm text-muted-foreground">
          {error || 'The requested project could not be loaded.'}
        </p>
        <Button variant="outline" onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteProject(currentProject.id);
      setIsDeleteOpen(false);
      navigate('/projects');
    } catch {
      // Handled by store
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{currentProject.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Created on {new Date(currentProject.createdAt).toLocaleDateString('en-GB')}
          </p>
        </div>
        {isPm && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="gap-1.5">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)} className="gap-1.5">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {currentProject.description || 'No description provided for this project.'}
          </p>
        </CardContent>
      </Card>

      {/* Task List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">Tasks ({tasks.length})</h2>
            <p className="text-xs text-muted-foreground">Manage and track project tasks</p>
          </div>
          <Button onClick={() => setIsCreateTaskOpen(true)} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>

        {isTaskLoading && tasks.length === 0 ? (
          <PageLoader label="Loading tasks..." />
        ) : tasks.length === 0 ? (
          <div className="flex min-h-50 flex-col items-center justify-center rounded-lg border border-dashed border-border p-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-muted-foreground/40 mb-2" />
            <h4 className="text-sm font-semibold text-foreground">No tasks yet</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Create a task to assign work and track progress.
            </p>
            <Button onClick={() => setIsCreateTaskOpen(true)} size="sm" variant="outline" className="mt-3 gap-1.5">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="divide-y divide-border">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/projects/${currentProject.id}/tasks/${task.id}`)}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-accent/40 cursor-pointer"
                >
                  <div className="space-y-1 pr-4">
                    <h4 className="text-sm font-semibold text-foreground leading-none">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-medium text-muted-foreground">
                      {getUserName(task.assignedTo)}
                    </span>
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isPm && isEditOpen && (
        <EditProjectDialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          project={currentProject}
        />
      )}

      {isPm && isDeleteOpen && (
        <ConfirmDialog
          isOpen={isDeleteOpen}
          title="Delete Project"
          description={`Are you sure you want to delete "${currentProject.name}"? This action cannot be undone.`}
          confirmText="Delete Project"
          variant="destructive"
          onConfirm={() => void handleDelete()}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}

      {isCreateTaskOpen && id && (
        <CreateTaskDialog
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          projectId={id}
        />
      )}
    </div>
  );
};