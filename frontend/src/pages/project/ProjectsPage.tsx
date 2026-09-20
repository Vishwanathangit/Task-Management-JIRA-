import { FolderKanban, FolderPlus, Search, X } from 'lucide-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateProjectDialog } from '@/components/common/CreateProjectDialog';
import { DatePickerField } from '@/components/common/DatePickerField';
import { PageLoader } from '@/components/common/PageLoader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ROLES } from '@/constants/roles';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
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

  const { projects, pagination, fetchProjects, isLoading } = useProjectStore();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const fromDateFromUrl = searchParams.get('fromDate') || '';
  const toDateFromUrl = searchParams.get('toDate') || '';

  React.useEffect(() => {
    void fetchProjects({
      search: searchFromUrl || undefined,
      fromDate: fromDateFromUrl || undefined,
      toDate: toDateFromUrl || undefined,
      page: pageFromUrl,
      limit: 10,
    });
  }, [searchFromUrl, fromDateFromUrl, toDateFromUrl, pageFromUrl, fetchProjects]);

  const isPm = user?.role === ROLES.PM;
  const isAnyFilterActive = Boolean(searchFromUrl || fromDateFromUrl || toDateFromUrl);

  const handleClearAll = (): void => {
    clearAllFilters(['fromDate', 'toDate']);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and organize your team's projects ({pagination.total} total)
          </p>
        </div>
        {isPm && (
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Create Project
          </Button>
        )}
      </div>

      {/* Search and Date Range Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:flex-wrap">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        <DatePickerField
          label="From"
          value={fromDateFromUrl}
          onChange={(v) => updateParam('fromDate', v || '')}
          maxDate={new Date()}
        />

        <DatePickerField
          label="To"
          value={toDateFromUrl}
          onChange={(v) => updateParam('toDate', v || '')}
          maxDate={new Date()}
        />

        {isAnyFilterActive && (
          <Button variant="ghost" onClick={handleClearAll} className="text-sm font-medium">
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
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

          {fromDateFromUrl && (
            <Badge variant="secondary" className="gap-1.5 py-1 px-2.5">
              From: {fromDateFromUrl}
              <button
                type="button"
                onClick={() => removeFilter('fromDate')}
                className="hover:text-destructive focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {toDateFromUrl && (
            <Badge variant="secondary" className="gap-1.5 py-1 px-2.5">
              To: {toDateFromUrl}
              <button
                type="button"
                onClick={() => removeFilter('toDate')}
                className="hover:text-destructive focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {isLoading && projects.length === 0 ? (
        <PageLoader label="Loading projects..." />
      ) : projects.length === 0 ? (
        <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-semibold text-foreground">No projects found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {isAnyFilterActive
              ? 'No projects match your filter criteria.'
              : isPm
              ? 'Get started by creating your first project.'
              : 'There are no active projects to display right now.'}
          </p>
          {isAnyFilterActive ? (
            <Button onClick={handleClearAll} variant="outline" className="mt-4">
              Clear Filters
            </Button>
          ) : (
            isPm && (
              <Button onClick={() => setIsCreateOpen(true)} variant="outline" className="mt-4 gap-2">
                <FolderPlus className="h-4 w-4" />
                Create Project
              </Button>
            )
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="flex flex-col justify-between transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    View Tasks
                  </Button>
                </CardFooter>
              </Card>
            ))}
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

      {isPm && (
        <CreateProjectDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
};
