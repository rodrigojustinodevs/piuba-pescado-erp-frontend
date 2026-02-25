'use client';

import { ChevronRightIcon, FilterIcon } from '@/shared/components/icons/AppIcons';
import { SearchField } from './SearchField';
import { SortButton } from './SortButton';

type ListSearchAndSortBarProps = {
  search: string;
  onSearchChange: (next: string) => void;
  searchPlaceholder: string;
  sortBy?: string;
  onSort?: (val: string) => void;
};

export function ListSearchAndSortBar({
  search,
  onSearchChange,
  searchPlaceholder,
  sortBy,
  onSort,
}: Readonly<ListSearchAndSortBarProps>) {
  return (
    <section className="flex flex-wrap items-center gap-3">
      <SearchField value={search} placeholder={searchPlaceholder} onChange={onSearchChange} />
      <SortButton current={sortBy} onSort={onSort} />
    </section>
  );
}

type ListSummaryBarProps = {
  total: number;
  singularLabel: string;
  pluralLabel: string;
};

export function ListSummaryBar({
  total,
  singularLabel,
  pluralLabel,
}: Readonly<ListSummaryBarProps>) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-600">
        {total} {total === 1 ? singularLabel : pluralLabel}
      </p>
      <button
        type="button"
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <FilterIcon className="h-4 w-4" />
        Filtros avançados
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
