import { Plus, Search, X } from 'lucide-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateTaskDialog } from '@/components/common/CreateTaskDialog';
import { PageLoader } from '@/components/common/PageLoader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TASK_STATUS, type TaskStatus } from '@/constants/taskStatus';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useProjectStore } from '@/store/projectStore';
import { useTaskStore } from '@/store/taskStore';
import { useUserStore } from '@/store/userStore';

const statusOptions: { label: string; value: TaskStatus }[] = [
  { label: 'To Do', value: TASK_STATUS.TODO },
  { label: 'In Progress', value: TASK_STATUS.IN_PROGRESS },
  { label: 'Completed', value: TASK_STATUS.COMPLETED },
  { label: 'Staging', value: TASK_STATUS.STAGING },
  { label: 'Production', value: TASK_STATUS.PRODUCTION },
  { label: 'Closed', value: TASK_STATUS.CLOSED },
];

export const TaskPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchParams,
    searchInput,
    setSearchInput,
    searchFromUrl,
    pageFromUrl,
    updateParam,
    removeFilter,
    clearAllFilters,
    handlePageChange,
  } = useUrlFilters();

  const { tasks, pagination, fetchAllTasks, isLoading, error } = useTaskStore();
  const { users, fetchUsers, getUserName } = useUserStore();
  const { projects, fetchProjects } = useProjectStore();

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const statusFromUrl = (searchParams.get('status') as TaskStatus) || '';
  const projectIdFromUrl = searchParams.get('projectId') || '';
  const assignedToFromUrl = searchParams.get('assignedTo') || '';

  // Fetch reference data on mount
  React.useEffect(() => {
    void fetchUsers();
    void fetchProjects();
  }, [fetchUsers, fetchProjects]);

  // Fetch tasks whenever URL parameters change
  React.useEffect(() => {
    void fetchAllTasks({
      search: searchFromUrl || undefined,
      page: pageFromUrl,
      limit: 10,
      status: statusFromUrl ? (statusFromUrl as TaskStatus) : undefined,
      projectId: projectIdFromUrl || undefined,
      assignedTo: assignedToFromUrl || undefined,
    });
  }, [searchFromUrl, pageFromUrl, statusFromUrl, projectIdFromUrl, assignedToFromUrl, fetchAllTasks]);

  const getProjectName = React.useCallback(
    (projectId: string): string => {
      const proj = projects.find((p) => p.id === projectId);
      return proj ? proj.name : 'Unknown Project';
    },
    [projects]
  );

  const isAnyFilterActive = Boolean(
    searchFromUrl || statusFromUrl || projectIdFromUrl || assignedToFromUrl
  );

  const handleClearAll = (): void => {
    clearAllFilters(['status', 'projectId', 'assignedTo']);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage tasks across all projects ({pagination.total} total)
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:flex-wrap">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, assignee, project, or status..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="w-full md:w-40">
          <Select
            value={statusFromUrl || 'ALL'}
            onValueChange={(val) => updateParam('status', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-50">
          <Select
            value={projectIdFromUrl || 'ALL'}
            onValueChange={(val) => updateParam('projectId', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Projects</SelectItem>
              {projects.map((proj) => (
                <SelectItem key={proj.id} value={proj.id}>
                  {proj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-45">
          <Select
            value={assignedToFromUrl || 'ALL'}
            onValueChange={(val) => updateParam('assignedTo', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Assignees</SelectItem>
              {users.map((usr) => (
                <SelectItem key={usr.id} value={usr.id}>
                  {usr.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isAnyFilterActive && (
          <Button variant="ghost" onClick={handleClearAll} className="text-sm font-medium">
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Chips */}
      {isAnyFilterActive && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {searchFromUrl && (
            <Badge variant="secondary" className="gap-1.5 py-1 px-2.5">
              Search: {searchFromUrl}
              <button
                type="button"
                onClick={() => removeFilter('search')}
                className="hover:text-destructive focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {statusFromUrl && (
            <Badge variant="secondary" className="gap-1.5 py-1 px-2.5">
              Status: {statusFromUrl.replace('_', ' ')}
              <button
                type="button"
                onClick={() => removeFilter('status')}
                className="hover:text-destructive focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {projectIdFromUrl && (
            <Badge variant="secondary" className="gap-1.5 py-1 px-2.5">
              Project: {getProjectName(projectIdFromUrl)}
              <button
                type="button"
                onClick={() => removeFilter('projectId')}
                className="hover:text-destructive focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {assignedToFromUrl && (
            <Badge variant="secondary" className="gap-1.5 py-1 px-2.5">
              Assignee: {getUserName(assignedToFromUrl)}
              <button
                type="button"
                onClick={() => removeFilter('assignedTo')}
                className="hover:text-destructive focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive border border-destructive/30">
          {error}
        </div>
      )}

      {isLoading && tasks.length === 0 ? (
        <PageLoader label="Loading tasks..." />
      ) : tasks.length === 0 ? (
        <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
          <h3 className="text-lg font-semibold text-foreground">No tasks found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {isAnyFilterActive
              ? 'No tasks match the active search and filter criteria.'
              : 'There are no tasks created in any project yet.'}
          </p>
          {isAnyFilterActive && (
            <Button variant="outline" onClick={handleClearAll} className="mt-4">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/projects/${task.projectId}/tasks/${task.id}`)}
                  className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-accent/40"
                >
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{task.title}</span>
                      <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        {getProjectName(task.projectId)}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {getUserName(task.assignedTo)}
                    </span>
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(pageFromUrl - 1, pagination.totalPages)}
                      className={pageFromUrl <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-sm px-4 py-2 font-medium">
                      Page {pageFromUrl} of {pagination.totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(pageFromUrl + 1, pagination.totalPages)}
                      className={
                        pageFromUrl >= pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {isCreateOpen && (
        <CreateTaskDialog
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onTaskCreated={() =>
            void fetchAllTasks({
              search: searchFromUrl || undefined,
              page: pageFromUrl,
              limit: 10,
              status: statusFromUrl ? (statusFromUrl as TaskStatus) : undefined,
              projectId: projectIdFromUrl || undefined,
              assignedTo: assignedToFromUrl || undefined,
            })
          }
        />
      )}
    </div>
  );
};
