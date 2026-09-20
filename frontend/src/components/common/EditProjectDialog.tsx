import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useProjectStore } from '@/store/projectStore';
import type { IProject } from '@/types/project.types';
import { type UpdateProjectFormData, updateProjectSchema } from '@/validators/project.validators';

export interface EditProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: IProject;
}

export const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { updateProject, isLoading } = useProjectStore();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProjectFormData>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || '',
    },
  });

  React.useEffect(() => {
    reset({
      name: project.name,
      description: project.description || '',
    });
  }, [project, reset]);

  const handleClose = (): void => {
    setErrorMessage(null);
    onClose();
  };

  const onSubmit = async (data: UpdateProjectFormData): Promise<void> => {
    setErrorMessage(null);
    try {
      await updateProject(project.id, data);
      handleClose();
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Failed to update project. Please try again.');
      }
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Project"
      description="Update project name and description"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {errorMessage && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/30">
            {errorMessage}
          </div>
        )}
        <FormInput
          label="Project Name"
          placeholder="Project name"
          error={errors.name?.message}
          {...register('name')}
        />
        <FormTextarea
          label="Description"
          placeholder="Project description"
          error={errors.description?.message}
          {...register('description')}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
