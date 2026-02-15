'use client';

import { useCallback, useState } from 'react';

export type StatusFilter = 'all' | 'active' | 'inactive';

type UseListPageStateArgs<TFilter extends string> = {
  initialPage?: number;
  initialSearch?: string;
  initialFilter?: TFilter;
  initialSortBy?: string;
};

/**
 * Estado comum de páginas de listagem (paginação, busca, filtro e ordenação).
 * Ajuda a evitar duplicação entre listas diferentes (ex.: Tanques, Empresas).
 */
export function useListPageState<TFilter extends string = StatusFilter>({
  initialPage = 1,
  initialSearch = '',
  initialFilter = 'all' as TFilter,
  initialSortBy = 'name',
}: UseListPageStateArgs<TFilter> = {}) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearchState] = useState(initialSearch);
  const [filter, setFilter] = useState<TFilter>(initialFilter);
  const [sortBy, setSortBy] = useState(initialSortBy);

  const setSearch = useCallback((next: string) => {
    setSearchState(next);
    // Mantém o comportamento existente nas páginas: ao buscar, voltar para a página 1.
    setPage(1);
  }, []);

  return {
    page,
    setPage,
    search,
    setSearch,
    filter,
    setFilter,
    sortBy,
    setSortBy,
  };
}
