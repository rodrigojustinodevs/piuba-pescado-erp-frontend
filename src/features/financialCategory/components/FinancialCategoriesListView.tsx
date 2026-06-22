'use client';

import { useState, useCallback } from 'react';
import type {
  FinancialCategory,
  FinancialCategoryListResponse,
  FinancialCategoryDialogMode,
  FinancialCategoryCatalogStats,
  FinancialCategoryTypeStrict,
  FinancialCategoryStatusStrict,
} from '../types';
import { FinancialCategoryTable } from './FinancialCategoryTable';
import { FinancialCategoryDialog } from './FinancialCategoryDialog';
import { FinancialCategoryCatalogStatsCards } from './FinancialCategoryCatalogStats';
import { Button } from '@/shared/components/ui/Button';
import { Eye, Pencil, Plus, Trash } from 'lucide-react';
import { SearchField } from '@/shared/components/list';
import { Pagination } from '@/shared/components/list/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';

type TypeFilter = FinancialCategoryTypeStrict | 'all';

export type FinancialCategoriesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  type: TypeFilter;
  setType: (next: TypeFilter) => void;
  status: FinancialCategoryStatusStrict | 'all';
  setStatus: (next: FinancialCategoryStatusStrict | 'all') => void;
  data: FinancialCategoryListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  financialCategories: FinancialCategory[];
  stats: FinancialCategoryCatalogStats;
  onDeleteCategory?: (id: string, label: string) => void;
  isDeletingCategory?: boolean;
};

const PER_PAGE = 25;

export function FinancialCategoriesListView({
  page,
  setPage,
  search,
  setSearch,
  type,
  setType,
  data,
  isLoading,
  error,
  financialCategories,
  stats,
  onDeleteCategory,
  isDeletingCategory = false,
}: Readonly<FinancialCategoriesListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<FinancialCategoryDialogMode>('create');
  const [selectedCategory, setSelectedCategory] = useState<FinancialCategory | null>(null);

  const openDialog = useCallback(
    (mode: FinancialCategoryDialogMode, category: FinancialCategory | null = null) => {
      setDialogMode(mode);
      setSelectedCategory(category);
      setDialogOpen(true);
    },
    [],
  );

  const getRowActions = useCallback(
    (row: FinancialCategory) => [
      {
        label: 'Ver detalhes',
        onClick: () => openDialog('view', row),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openDialog('edit', row),
        icon: <Pencil className="h-4 w-4" />,
      },
      {
        label: 'Excluir',
        onClick: () => onDeleteCategory?.(row.id, row.name),
        icon: <Trash className="h-4 w-4" />,
        variant: 'danger' as const,
        disabled: isDeletingCategory,
      },
    ],
    [openDialog, onDeleteCategory, isDeletingCategory],
  );

  const total = data?.total ?? 0;
  const pagedCategories = financialCategories.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16 text-slate-400">Carregando...</div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center py-16 text-red-500 text-sm">
          Erro ao carregar categorias financeiras.
        </div>
      );
    }
    if (financialCategories.length === 0) {
      return (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
          Nenhuma categoria financeira encontrada.
        </div>
      );
    }
    return (
      <>
        <FinancialCategoryTable
          financialCategories={pagedCategories}
          getRowActions={getRowActions}
        />
        <Pagination
          page={page}
          limit={PER_PAGE}
          total={total}
          itemLabelPlural="categorias"
          onPageChange={setPage}
        />
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categorias Financeiras</h1>
          <p className="mt-1 text-sm text-slate-500">Organize receitas e despesas por categoria.</p>
        </div>
        <Button className="gap-2 shrink-0" onClick={() => openDialog('create')}>
          <Plus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Stats */}
      <FinancialCategoryCatalogStatsCards stats={stats} />

      {/* Table card */}
      <Card>
        <CardHeader className="px-5 py-4">
          <CardTitle className="text-base">Lista de Categorias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchField
                search={search}
                setSearch={setSearch}
                setCurrentPage={setPage}
                placeholder="Buscar por nome..."
              />
            </div>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as TypeFilter);
                setPage(1);
              }}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5A4]"
            >
              <option value="all">Todos os tipos</option>
              <option value="revenue">Receita</option>
              <option value="expense">Despesa</option>
              <option value="investment">Investimento</option>
            </select>
          </div>

          <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {renderContent()}
          </main>
        </CardContent>
      </Card>

      <FinancialCategoryDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedCategory(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        category={selectedCategory}
        onSuccess={() => setDialogOpen(false)}
      />
    </div>
  );
}
