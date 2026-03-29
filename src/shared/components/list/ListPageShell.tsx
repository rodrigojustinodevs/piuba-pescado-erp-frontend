'use client';

import type { ReactNode } from 'react';
import { ChevronRightIcon, FilterIcon, SpinnerIcon } from '@/shared/components/icons/AppIcons';
import { Pagination } from './Pagination';

export type ListPageShellPagination = {
  page: number;
  limit: number;
  total: number;
  itemLabelPlural: string;
  onPageChange: (page: number) => void;
};

export type ListPageShellProps = {
  listHeader: ReactNode;
  toolbar: ReactNode;
  total: number;
  totalLabelSingular: string;
  totalLabelPlural: string;
  isLoading: boolean;
  error: unknown;
  errorMessage: string;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
  pagination?: ListPageShellPagination | null;
};

function ListLoadingState() {
  return (
    <div className="p-8 text-center">
      <div className="flex items-center justify-center gap-2 text-slate-500">
        <SpinnerIcon className="w-5 h-5 animate-spin" />
        <span>Carregando...</span>
      </div>
    </div>
  );
}

export function ListPageShell({
  listHeader,
  toolbar,
  total,
  totalLabelSingular,
  totalLabelPlural,
  isLoading,
  error,
  errorMessage,
  isEmpty,
  emptyMessage,
  children,
  pagination,
}: Readonly<ListPageShellProps>) {
  const renderMain = () => {
    if (isLoading) return <ListLoadingState />;
    if (error) return <div className="p-8 text-center text-red-600">{errorMessage}</div>;
    if (isEmpty) return <div className="p-8 text-center text-slate-500">{emptyMessage}</div>;
    return (
      <>
        {children}
        {pagination && pagination.total > pagination.limit ? (
          <Pagination
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total}
            itemLabelPlural={pagination.itemLabelPlural}
            onPageChange={pagination.onPageChange}
          />
        ) : null}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {listHeader}
      {toolbar}
      <section className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {total} {total === 1 ? totalLabelSingular : totalLabelPlural}
        </p>
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <FilterIcon className="h-4 w-4" />
          Filtros avançados
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </section>
      <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {renderMain()}
      </main>
    </div>
  );
}
