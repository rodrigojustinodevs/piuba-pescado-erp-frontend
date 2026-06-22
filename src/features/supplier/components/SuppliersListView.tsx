'use client';

import { useCallback, useState } from 'react';
import type { Supplier, SupplierListResponse, SupplierDialogMode } from '../types';
import { CATEGORY_LABELS } from '../types';
import type { SupplierStatusFilter } from '../hooks/useSuppliersListPage';
import { SupplierTable } from './SupplierTable';
import { SupplierDialog } from './SupplierDialog';
import { Button } from '@/shared/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import { Plus } from 'lucide-react';
import { FilterSelect, SearchField } from '@/shared/components/list';
import { Pagination } from '@/shared/components/list/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';
import {
  ListEmptyState,
  ListErrorState,
  ListLoadingState,
} from '@/shared/components/states/ListStates';
import { createStandardRowActions } from '@/shared/utils/rowActions';

const STATUS_TAB_LABELS: Record<SupplierStatusFilter, string> = {
  all: 'Todos',
  active: 'Ativos',
  inactive: 'Inativos',
  suspended: 'Suspensos',
};

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'name', label: 'Nome' },
  { value: 'category', label: 'Categoria' },
  { value: 'city', label: 'Cidade' },
  { value: 'rating', label: 'Avaliação' },
  { value: 'totalPurchases', label: 'Total comprado' },
];

export type SuppliersListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  statusFilter: SupplierStatusFilter;
  setStatusFilter: (next: SupplierStatusFilter) => void;
  categoryFilter: string;
  setCategoryFilter: (next: string) => void;
  data: SupplierListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  suppliers: Supplier[];
  statusCounts: Record<SupplierStatusFilter, number>;
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

export function SuppliersListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  isLoading,
  error,
  suppliers,
  handleDelete,
}: Readonly<SuppliersListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<SupplierDialogMode>('create');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [perPage] = useState(10);

  const openDialog = useCallback((mode: SupplierDialogMode, supplier: Supplier | null = null) => {
    setDialogMode(mode);
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  }, []);

  const getRowActions = useCallback(
    (row: Supplier) =>
      createStandardRowActions(
        () => openDialog('view', row),
        () => openDialog('edit', row),
        () => handleDelete(row.id, row.name),
      ),
    [handleDelete, openDialog],
  );

  const total = suppliers.length;
  const pagedSuppliers = suppliers.slice((page - 1) * perPage, page * perPage);

  const renderContent = () => {
    if (isLoading) return <ListLoadingState />;
    if (error) return <ListErrorState title="Erro ao carregar fornecedores" message="Não foi possível carregar os fornecedores. Tente novamente." />;
    if (suppliers.length === 0) return <ListEmptyState title="Nenhum fornecedor encontrado." />;
    return (
      <>
        <SupplierTable suppliers={pagedSuppliers} getRowActions={getRowActions} />
        <Pagination page={page} limit={perPage} total={total} itemLabelPlural="fornecedores" onPageChange={setPage} />
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fornecedores</h1>
          <p className="mt-1 text-sm text-slate-500">Relação de fornecedores da empresa.</p>
        </div>
        <Button className="gap-2 shrink-0" onClick={() => openDialog('create')}>
          <Plus className="h-4 w-4" />
          Novo Fornecedor
        </Button>
      </div>

      <Card>
        <CardHeader className="flex-row justify-between px-5 py-4">
          <CardTitle className="text-base">Lista de Fornecedores</CardTitle>
          <Tabs
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as SupplierStatusFilter);
              setPage(1);
            }}
          >
            <TabsList>
              {(Object.keys(STATUS_TAB_LABELS) as SupplierStatusFilter[]).map((key) => (
                <TabsTrigger key={key} value={key}>
                  {STATUS_TAB_LABELS[key]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchField
                search={search}
                setSearch={setSearch}
                setCurrentPage={setPage}
                placeholder="Buscar por nome, documento ou e-mail..."
              />
            </div>
            <FilterSelect value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
              <option value="">Todas as categorias</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </FilterSelect>
            <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>Ordenar por: {option.label}</option>
              ))}
            </FilterSelect>
          </div>

          <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {renderContent()}
          </main>
        </CardContent>
      </Card>

      <SupplierDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedSupplier(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        supplier={selectedSupplier}
        onSuccess={() => setDialogOpen(false)}
      />
    </div>
  );
}
