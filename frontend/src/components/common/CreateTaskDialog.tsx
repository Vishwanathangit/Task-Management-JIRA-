import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/common/FormInput';
import { FormSelect, type SelectOption } from '@/components/common/FormSelect';
import { FormTextarea } from '@/components/common/FormTextarea';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { TASK_STATUS, type TaskStatus } from '@/constants/taskStatus';
import { useProjectStore } from '@/store/projectStore';
import { useTaskStore } from '@/store/taskStore';
import { useUserStore } from '@/store/userStore';
import { type CreateTaskFormData, createTaskSchema } from '@/validators/task.validators';

export interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  onTaskCreated?: () => void;
}

const statusOptions: SelectOption[] = [
  { label: 'To Do', value: TASK_STATUS.TODO },
  { label: 'In Progress', value: TASK_STATUS.IN_PROGRESS },
  { label: 'Completed', value: TASK_STATUS.COMPLETED },
  { label: 'Staging', value: TASK_STATUS.STAGING },
  { label: 'Production', value: TASK_STATUS.PRODUCTION },
  { label: 'Closed', value: TASK_STATUS.CLOSED },
];

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  isOpen,
  onClose,
  projectId: projectIdProp,
  onTaskCreated,
}) => {
  const { createTask, isLoading } = useTaskStore();
  const { users, fetchUsers } = useUserStore();
  const { projects, fetchProjects } = useProjectStore();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    void fetchUsers();
    if (!projectIdProp) {
      void fetchProjects();
    }
  }, [fetchUsers, fetchProjects, projectIdProp]);

  const userOptions: SelectOption[] = [
    { label: 'Unassigned', value: '' },
    ...users.map((u) => ({
      label: `${u.name} (${u.role})`,
      value: u.id,
    })),
  ];

  const projectOptions: SelectOption[] = [
    { label: 'Select a project...', value: '' },
    ...projects.map((p) => ({
      label: p.name,
      value: p.id,
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
      projectId: projectIdProp || '',
      title: '',
      description: '',
      assignedTo: '',
      status: TASK_STATUS.TODO,
    },
  });

  const handleClose = (): void => {
    reset();
    setErrorMessage(null);
    onClose();
  };

  const onSubmit = async (data: CreateTaskFormData): Promise<void> => {
    setErrorMessage(null);
    const targetProjectId = projectIdProp || data.projectId;

    if (!targetProjectId) {
      setErrorMessage('Please select a project for this task.');
      return;
    }

    try {
      await createTask({
        projectId: targetProjectId,
        title: data.title,
        description: data.description || undefined,
        assignedTo: data.assignedTo || undefined,
        status: (data.status as TaskStatus) || TASK_STATUS.TODO,
      });
      onTaskCreated?.();
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
      description="Add a new task to your project"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {errorMessage && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/30">
            {errorMessage}
          </div>
        )}
        {!projectIdProp && (
          <FormSelect
            label="Project"
            options={projectOptions}
            error={errors.projectId?.message}
            {...register('projectId')}
          />
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
        <FormSelect
          label="Initial Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
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
