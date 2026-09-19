import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EditProjectDialog } from '@/components/common/EditProjectDialog';
import { PageLoader } from '@/components/common/PageLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROLES } from '@/constants/roles';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';

export const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentProject, fetchProjectById, deleteProject, isLoading, error } = useProjectStore();

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      void fetchProjectById(id);
    }
  }, [id, fetchProjectById]);

  const isPm = user?.role === ROLES.PM;

  if (isLoading && !currentProject) {
    return <PageLoader label="Loading project details..." />;
  }

  if (error || !currentProject) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-xl font-semibold text-foreground">Project Not Found</h2>
        <p className="text-sm text-muted-foreground">
          {error || 'The requested project could not be loaded.'}
        </p>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteProject(currentProject.id);
      setIsDeleteOpen(false);
      navigate('/dashboard');
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{currentProject.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Created on {new Date(currentProject.createdAt).toLocaleDateString()}
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

      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <h3 className="text-lg font-semibold text-foreground">Tasks (coming next)</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Task management, assignment, and status boards for this project will be rendered here.
        </p>
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
    </div>
  );
};
