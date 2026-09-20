import * as React from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDebounce } from './useDebounce';

interface UseUrlFiltersOptions {
  debounceDelay?: number;
}

export function useUrlFilters(options: UseUrlFiltersOptions = {}) {
  const { debounceDelay = 400 } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const searchFromUrl = searchParams.get('search') || '';
  const pageFromUrl = Number(searchParams.get('page')) || 1;

  const [searchInput, setSearchInput] = React.useState(searchFromUrl);
  const [prevSearchFromUrl, setPrevSearchFromUrl] = React.useState(searchFromUrl);
  const isClearingRef = React.useRef(false);

  if (prevSearchFromUrl !== searchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl);
    setSearchInput(searchFromUrl);
  }

  const debouncedSearch = useDebounce(searchInput, debounceDelay);

  React.useEffect(() => {
    if (isClearingRef.current) {
      isClearingRef.current = false;
      return;
    }
    const currentSearch = searchParams.get('search') || '';
    if (debouncedSearch !== currentSearch) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) {
          next.set('search', debouncedSearch);
        } else {
          next.delete('search');
        }
        next.set('page', '1');
        return next;
      });
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  const updateParam = React.useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value && value !== 'ALL') {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        next.set('page', '1');
        return next;
      });
    },
    [setSearchParams]
  );

  const removeFilter = React.useCallback(
    (key: string) => {
      if (key === 'search') {
        isClearingRef.current = true;
        setSearchInput('');
      }
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete(key);
        next.set('page', '1');
        return next;
      });
    },
    [setSearchParams]
  );

  const clearAllFilters = React.useCallback(
    (filterKeys: string[]) => {
      isClearingRef.current = true;
      setSearchInput('');
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        filterKeys.forEach((key) => next.delete(key));
        next.delete('search');
        next.set('page', '1');
        return next;
      });
    },
    [setSearchParams]
  );

  const handlePageChange = React.useCallback(
    (newPage: number, totalPages: number) => {
      if (newPage < 1 || newPage > totalPages) return;
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', String(newPage));
        return next;
      });
    },
    [setSearchParams]
  );

  return {
    searchParams,
    setSearchParams,
    searchInput,
    setSearchInput,
    searchFromUrl,
    pageFromUrl,
    updateParam,
    removeFilter,
    clearAllFilters,
    handlePageChange,
  };
}
