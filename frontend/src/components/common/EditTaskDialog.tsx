import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useTaskStore } from '@/store/taskStore';
import type { ITask } from '@/types/task.types';
import { type UpdateTaskFormData, updateTaskSchema } from '@/validators/task.validators';

export interface EditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: ITask;
}

export const EditTaskDialog: React.FC<EditTaskDialogProps> = ({ isOpen, onClose, task }) => {
  const { updateTask, isLoading } = useTaskStore();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
    },
  });

  React.useEffect(() => {
    reset({
      title: task.title,
      description: task.description || '',
    });
  }, [task, reset]);

  const handleClose = (): void => {
    setErrorMessage(null);
    onClose();
  };

  const onSubmit = async (data: UpdateTaskFormData): Promise<void> => {
    setErrorMessage(null);
    try {
      await updateTask(task.id, data);
      handleClose();
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Failed to update task. Please try again.');
      }
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Task"
      description="Update task title and description"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {errorMessage && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/30">
            {errorMessage}
          </div>
        )}
        <FormInput
          label="Title"
          placeholder="Task title"
          error={errors.title?.message}
          {...register('title')}
        />
        <FormTextarea
          label="Description"
          placeholder="Task description..."
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
