'use client';

import { useState, useCallback } from 'react';
import type {
  StockLocation,
  StockListResponse,
  StockDialogMode,
  StockCatalogStats,
} from '../types';
import { StockTable } from './StockTable';
import { StockDialog } from './StockDialog';
import { StockCatalogStatsCards } from './StockCatalogStats';
import { Button } from '@/shared/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import { Plus } from 'lucide-react';
import { FilterSelect, SearchField } from '@/shared/components/list';
import { Pagination } from '@/shared/components/list/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import {
  ListEmptyState,
  ListErrorState,
  ListLoadingState,
} from '@/shared/components/states/ListStates';
import { createStandardRowActions } from '@/shared/utils/rowActions';
import { stockLocationTypeOptions } from '../schemas';

export type StocksListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  typeFilter: string;
  setTypeFilter: (next: string) => void;
  statusFilter: string;
  setStatusFilter: (next: string) => void;
  data: StockListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  stocks: StockLocation[];
  stats: StockCatalogStats;
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

export function StocksListView({
  page,
  setPage,
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  data,
  isLoading,
  error,
  stocks,
  stats,
  handleDelete,
}: Readonly<StocksListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<StockDialogMode>('create');
  const [selectedStock, setSelectedStock] = useState<StockLocation | null>(null);
  const [perPage] = useState(10);

  const openDialog = useCallback((mode: StockDialogMode, stock: StockLocation | null = null) => {
    setDialogMode(mode);
    setSelectedStock(stock);
    setDialogOpen(true);
  }, []);

  const getRowActions = useCallback(
    (row: StockLocation) =>
      createStandardRowActions(
        () => openDialog('view', row),
        () => openDialog('edit', row),
        () => handleDelete(row.id, row.name),
      ),
    [handleDelete, openDialog],
  );

  const total = data?.total ?? 0;
  const pagedStocks = stocks.slice((page - 1) * perPage, page * perPage);

  const statusTabs: Array<{ value: string; label: string; count: number }> = [
    { value: '', label: 'Todos', count: stats.totalStocks },
    { value: 'active', label: 'Ativos', count: stats.activeCount },
    { value: 'inactive', label: 'Inativos', count: stats.inactiveCount },
  ];

  const renderContent = () => {
    if (isLoading) return <ListLoadingState />;
    if (error) return <ListErrorState title="Erro ao carregar locais" message="Não foi possível carregar os locais de armazenamento. Tente novamente." />;
    if (stocks.length === 0) return <ListEmptyState title="Nenhum local de armazenamento encontrado." />;
    return (
      <>
        <StockTable stocks={pagedStocks} getRowActions={getRowActions} />
        {!isLoading && !error && stocks.length > 0 && (
          <Pagination page={page} limit={perPage} total={total} itemLabelPlural="locais" onPageChange={setPage} />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Locais de Armazenamento</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie armazéns, câmaras frias, silos e demais locais de estoque.
          </p>
        </div>
        <Button className="gap-2 shrink-0" onClick={() => openDialog('create')}>
          <Plus className="h-4 w-4" />
          Novo Local
        </Button>
      </div>

      <StockCatalogStatsCards stats={stats} />

      <Card>
        <CardHeader className="flex-row justify-between px-5 py-4">
          <CardTitle className="text-base">Lista de Locais</CardTitle>
          <Tabs
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <TabsList>
              {statusTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
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
                placeholder="Buscar por código, nome, localização..."
              />
            </div>
            <FilterSelect value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
              <option value="">Todos os tipos</option>
              {stockLocationTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </FilterSelect>
          </div>

          <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {renderContent()}
          </main>
        </CardContent>
      </Card>

      <StockDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedStock(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        stock={selectedStock}
        onSuccess={() => setDialogOpen(false)}
      />

    </div>
  );
}
