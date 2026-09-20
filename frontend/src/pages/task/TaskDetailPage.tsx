import { ArrowLeft, Edit, MessageSquare, Trash2, UserPlus, Clock } from 'lucide-react';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AssignTaskDialog } from '@/components/common/AssignTaskDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EditTaskDialog } from '@/components/common/EditTaskDialog';
import { PageLoader } from '@/components/common/PageLoader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TASK_STATUS, type TaskStatus } from '@/constants/taskStatus';
import { useTaskStore } from '@/store/taskStore';
import { useUserStore } from '@/store/userStore';

const statusOptions = [
  { label: 'To Do', value: TASK_STATUS.TODO },
  { label: 'In Progress', value: TASK_STATUS.IN_PROGRESS },
  { label: 'Completed', value: TASK_STATUS.COMPLETED },
  { label: 'Staging', value: TASK_STATUS.STAGING },
  { label: 'Production', value: TASK_STATUS.PRODUCTION },
  { label: 'Closed', value: TASK_STATUS.CLOSED },
];

export const TaskDetailPage: React.FC = () => {
  const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
  const navigate = useNavigate();

  const {
    currentTask,
    timeline,
    fetchTaskById,
    fetchTaskTimeline,
    updateTaskStatus,
    deleteTask,
    addComment,
    isLoading,
    error,
  } = useTaskStore();

  const { fetchUsers, getUserName } = useUserStore();

  const [commentText, setCommentText] = React.useState('');
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isAssignOpen, setIsAssignOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  React.useEffect(() => {
    void fetchUsers();
    if (taskId) {
      void fetchTaskById(taskId);
      void fetchTaskTimeline(taskId);
    }
  }, [taskId, fetchTaskById, fetchTaskTimeline, fetchUsers]);

  if (isLoading && !currentTask) {
    return <PageLoader label="Loading task details..." />;
  }

  if (error || !currentTask) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-xl font-semibold text-foreground">Task Not Found</h2>
        <p className="text-sm text-muted-foreground">
          {error || 'The requested task could not be loaded.'}
        </p>
        <Button variant="outline" onClick={() => navigate(`/projects/${projectId || ''}`)}>
          Back to Project
        </Button>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: TaskStatus): Promise<void> => {
    try {
      await updateTaskStatus(currentTask.id, newStatus);
      await fetchTaskById(currentTask.id);
      await fetchTaskTimeline(currentTask.id);
    } catch {
      // Error handled by store
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteTask(currentTask.id);
      setIsDeleteOpen(false);
      navigate(`/projects/${projectId || currentTask.projectId}`);
    } catch {
      // Error handled by store
    }
  };

  const handleAddComment = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addComment(currentTask.id, commentText.trim());
      setCommentText('');
    } catch {
      // Error handled by store
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const renderActionText = (item: (typeof timeline)[0]): string => {
    if (item.type === 'COMMENT') {
      return item.message || '';
    }

    switch (item.action) {
      case 'CREATED':
        return 'created this task';
      case 'STATUS_CHANGED':
        return `changed status from ${item.fromValue || 'TODO'} to ${item.toValue}`;
      case 'ASSIGNED':
        return `assigned task to ${getUserName(item.toValue)}`;
      case 'REASSIGNED':
        return `reassigned task to ${getUserName(item.toValue)}`;
      case 'COMMENT_ADDED':
        return 'commented on this task';
      case 'UPDATED':
        return 'updated task details';
      default:
        return item.action || 'activity logged';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/projects/${projectId || currentTask.projectId}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{currentTask.title}</h1>
            <StatusBadge status={currentTask.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Created on {new Date(currentTask.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={currentTask.status}
            onValueChange={(val) => void handleStatusChange(val as TaskStatus)}
          >
            <SelectTrigger className="w-35 text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setIsAssignOpen(true)} className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            Assign
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="gap-1.5">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)} className="gap-1.5">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Task Details Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Details</CardTitle>
          <div className="text-xs text-muted-foreground">
            Assignee:{' '}
            <span className="font-semibold text-foreground">
              {getUserName(currentTask.assignedTo)}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {currentTask.description || 'No detailed description provided.'}
          </p>
        </CardContent>
      </Card>

      {/* Activity Feed & Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Activity & Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timeline Feed */}
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No activity logged yet.</p>
          ) : (
            <div className="space-y-4 border-l-2 border-border pl-4">
              {timeline.map((item) => (
                <div key={item.id} className="relative space-y-1">
                  <div className="absolute -left-5.25 top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{item.actorName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {item.type === 'COMMENT' ? (
                    <div className="rounded-md bg-accent/40 p-3 text-sm text-foreground mt-1">
                      {item.message}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">{renderActionText(item)}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <form onSubmit={(e) => void handleAddComment(e)} noValidate className="space-y-3 pt-4 border-t border-border">
            <Textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingComment || !commentText.trim()}
                className="gap-1.5"
              >
                <MessageSquare className="h-4 w-4" />
                {isSubmittingComment ? 'Posting...' : 'Add Comment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isEditOpen && (
        <EditTaskDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} task={currentTask} />
      )}

      {isAssignOpen && (
        <AssignTaskDialog
          isOpen={isAssignOpen}
          onClose={() => setIsAssignOpen(false)}
          task={currentTask}
          onAssigned={() => {
            if (taskId) {
              void fetchTaskById(taskId);
              void fetchTaskTimeline(taskId);
            }
          }}
        />
      )}

      {isDeleteOpen && (
        <ConfirmDialog
          isOpen={isDeleteOpen}
          title="Delete Task"
          description={`Are you sure you want to delete "${currentTask.title}"?`}
          confirmText="Delete Task"
          variant="destructive"
          onConfirm={() => void handleDelete()}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  );
};
