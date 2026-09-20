import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useProjectStore } from '@/store/projectStore';
import { type CreateProjectFormData, createProjectSchema } from '@/validators/project.validators';

export interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ isOpen, onClose }) => {
  const { createProject, isLoading } = useProjectStore();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleClose = (): void => {
    reset();
    setErrorMessage(null);
    onClose();
  };

  const onSubmit = async (data: CreateProjectFormData): Promise<void> => {
    setErrorMessage(null);
    try {
      await createProject(data);
      handleClose();
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Failed to create project. Please try again.');
      }
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Project"
      description="Add a new project to organize and track tasks"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {errorMessage && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/30">
            {errorMessage}
          </div>
        )}
        <FormInput
          label="Project Name"
          placeholder="e.g. E-commerce Revamp"
          error={errors.name?.message}
          {...register('name')}
        />
        <FormTextarea
          label="Description"
          placeholder="Brief description of the project goals..."
          error={errors.description?.message}
          {...register('description')}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
