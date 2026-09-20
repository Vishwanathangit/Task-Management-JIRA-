import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { FormSelect, type SelectOption } from '@/components/common/FormSelect';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useTaskStore } from '@/store/taskStore';
import { useUserStore } from '@/store/userStore';
import type { ITask } from '@/types/task.types';
import { type AssignTaskFormData, assignTaskSchema } from '@/validators/task.validators';

export interface AssignTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: ITask;
  onAssigned?: () => void;
}

export const AssignTaskDialog: React.FC<AssignTaskDialogProps> = ({
  isOpen,
  onClose,
  task,
  onAssigned,
}) => {
  const { assignTask, isLoading } = useTaskStore();
  const { users, fetchUsers } = useUserStore();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const userOptions: SelectOption[] = [
    { label: 'Select Assignee', value: '' },
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
  } = useForm<AssignTaskFormData>({
    resolver: zodResolver(assignTaskSchema),
    defaultValues: {
      assignedTo: task.assignedTo || '',
    },
  });

  React.useEffect(() => {
    reset({
      assignedTo: task.assignedTo || '',
    });
  }, [task, reset]);

  const handleClose = (): void => {
    setErrorMessage(null);
    onClose();
  };

  const onSubmit = async (data: AssignTaskFormData): Promise<void> => {
    setErrorMessage(null);
    try {
      await assignTask(task.id, data.assignedTo);
      if (onAssigned) {
        onAssigned();
      }
      handleClose();
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Failed to assign task. Please try again.');
      }
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Assign Task"
      description="Choose a team member to assign this task to"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/30">
            {errorMessage}
          </div>
        )}
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
            {isLoading ? 'Assigning...' : 'Assign Task'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
