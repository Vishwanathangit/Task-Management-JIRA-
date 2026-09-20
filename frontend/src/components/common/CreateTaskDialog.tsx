import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/common/FormInput';
import { FormSelect, type SelectOption } from '@/components/common/FormSelect';
import { FormTextarea } from '@/components/common/FormTextarea';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useTaskStore } from '@/store/taskStore';
import { useUserStore } from '@/store/userStore';
import { type CreateTaskFormData, createTaskSchema } from '@/validators/task.validators';

export interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const { createTask, isLoading } = useTaskStore();
  const { users, fetchUsers } = useUserStore();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const userOptions: SelectOption[] = [
    { label: 'Unassigned', value: '' },
    ...users.map((u) => ({
      label: `${u.name} (${u.role})`,
      value: u.id,
    })),
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
    },
  });

  const handleClose = (): void => {
    reset();
    setErrorMessage(null);
    onClose();
  };

  const onSubmit = async (data: CreateTaskFormData): Promise<void> => {
    setErrorMessage(null);
    try {
      await createTask({
        projectId,
        title: data.title,
        description: data.description || undefined,
        assignedTo: data.assignedTo || undefined,
      });
      handleClose();
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Failed to create task. Please try again.');
      }
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Task"
      description="Add a new task to this project"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/30">
            {errorMessage}
          </div>
        )}
        <FormInput
          label="Title"
          placeholder="e.g. Setup cart state management"
          error={errors.title?.message}
          {...register('title')}
        />
        <FormTextarea
          label="Description"
          placeholder="Detailed task description..."
          error={errors.description?.message}
          {...register('description')}
        />
        <FormSelect
          label="Assignee"
          options={userOptions}
          error={errors.assignedTo?.message}
          {...register('assignedTo')}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
