'use client';

import { useCallback, useMemo } from 'react';
import type {
  FinancialCategory,
  FinancialCategoryListResponse,
  FinancialCategoryStatusStrict,
  FinancialCategoryTypeStrict,
} from '../types';
import { FinancialCategoryTable } from './FinancialCategoryTable';
import { ListHeader, ListPageShell, SortButton } from '@/shared/components/list';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';
import { Select } from '@/shared/components/ui';

type TypeFilter = FinancialCategoryTypeStrict | 'all';
type StatusFilter = FinancialCategoryStatusStrict | 'all';

const TYPE_OPTIONS: Array<{ value: TypeFilter; label: string }> = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'revenue', label: 'Receita' },
  { value: 'expense', label: 'Despesa' },
  { value: 'investment', label: 'Investimento' },
];

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Todos os status' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
];

export type FinancialCategoriesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  type: TypeFilter;
  setType: (next: TypeFilter) => void;
  status: StatusFilter;
  setStatus: (next: StatusFilter) => void;
  data: FinancialCategoryListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  financialCategories: FinancialCategory[];
  onDeleteCategory?: (id: string, label: string) => void;
  isDeletingCategory?: boolean;
  onActivateCategory?: (id: string, label: string) => void;
  isActivatingCategory?: boolean;
  onDeactivateCategory?: (id: string, label: string) => void;
  isDeactivatingCategory?: boolean;
};

export function FinancialCategoriesListView({
  page,
  setPage,
  sortBy,
  setSortBy,
  type,
  setType,
  status,
  setStatus,
  data,
  isLoading,
  error,
  financialCategories,
  onDeleteCategory,
  isDeletingCategory = false,
  onActivateCategory,
  isActivatingCategory = false,
  onDeactivateCategory,
  isDeactivatingCategory = false,
}: Readonly<FinancialCategoriesListViewProps>) {
  const typeOptions = useMemo(
    () => TYPE_OPTIONS.map((option) => ({ value: option.value, label: option.label })),
    [],
  );
  const statusOptions = useMemo(
    () => STATUS_OPTIONS.map((option) => ({ value: option.value, label: option.label })),
    [],
  );
  const handleSort = useCallback((next: string) => setSortBy(next), [setSortBy]);

  return (
    <ListPageShell
      listHeader={
        <ListHeader
          icon={<OrdersIcon />}
          title="Categorias financeiras"
          subtitle="Relação de categorias financeiras da empresa"
          ctaHref="/company/financial-categories/create"
          ctaLabel="Nova categoria"
        />
      }
      toolbar={
        <section className="flex flex-wrap items-center gap-3 w-full">
          <div className="min-w-[220px]">
            <Select
              label="Tipo"
              labelInline={true}
              options={typeOptions}
              value={type}
              onChange={(e) => setType(e.target.value as TypeFilter)}
            />
          </div>
          <div className="min-w-[220px]">
            <Select
              label="Status"
              labelInline={true}
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
            />
          </div>
          <SortButton current={sortBy} onSort={handleSort} value="name" label="Nome" />
        </section>
      }
      total={data?.total ?? 0}
      totalLabelSingular="categoria encontrada"
      totalLabelPlural="categorias encontradas"
      isLoading={isLoading}
      error={error}
      errorMessage="Erro ao carregar categorias financeiras."
      isEmpty={!isLoading && !error && financialCategories.length === 0}
      emptyMessage="Nenhuma categoria financeira encontrada."
      pagination={
        data
          ? {
              page,
              limit: data.limit,
              total: data.total,
              itemLabelPlural: 'categorias',
              onPageChange: setPage,
            }
          : null
      }
    >
      <FinancialCategoryTable
        financialCategories={financialCategories}
        onDelete={onDeleteCategory}
        isDeleting={isDeletingCategory}
        onActivate={onActivateCategory}
        isActivating={isActivatingCategory}
        onDeactivate={onDeactivateCategory}
        isDeactivating={isDeactivatingCategory}
      />
    </ListPageShell>
  );
}
