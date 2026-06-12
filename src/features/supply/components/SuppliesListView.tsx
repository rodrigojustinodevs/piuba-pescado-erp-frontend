'use client';

import { useState, useCallback } from 'react';
import type { Supply, SupplyListResponse, SupplyDialogMode, SupplyCatalogStats } from '../types';
import { SupplyTable } from './SupplyTable';
import { SupplyDialog } from './SupplyDialog';
import { SupplyCatalogStatsCards } from './SupplyCatalogStats';
import { Button } from '@/shared/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import { Eye, Pencil, Plus, Trash } from 'lucide-react';
import { SearchField } from '@/shared/components/list';
import { Pagination } from '@/shared/components/list/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';

export type SuppliesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  categoryFilter: string;
  setCategoryFilter: (next: string) => void;
  statusFilter: string;
  setStatusFilter: (next: string) => void;
  typeFilter: string;
  setTypeFilter: (next: string) => void;
  data: SupplyListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  supplies: Supply[];
  categories: string[];
  stats: SupplyCatalogStats;
  handleDelete: (id: string) => void;
  isDeleting: boolean;
};

export function SuppliesListView({
  page,
  setPage,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  data,
  isLoading,
  error,
  supplies,
  categories,
  stats,
  handleDelete,
}: Readonly<SuppliesListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<SupplyDialogMode>('create');
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
  const [perPage, setPerPage] = useState(10);

  const openDialog = useCallback((mode: SupplyDialogMode, supply: Supply | null = null) => {
    setDialogMode(mode);
    setSelectedSupply(supply);
    setDialogOpen(true);
  }, []);

  const getRowActions = useCallback(
    (row: Supply) => [
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
        onClick: () => handleDelete(row.id),
        icon: <Trash className="h-4 w-4" />,
      },
    ],
    [handleDelete, openDialog],
  );

  const total = data?.total ?? 0;
  const pagedSupplies = supplies.slice((page - 1) * perPage, page * perPage);
  const renderContent = () => {
    return (
      <>
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">Carregando...</div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 text-red-500 text-sm">
            Erro ao carregar produtos.
          </div>
        ) : supplies.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            Nenhum produto encontrado.
          </div>
        ) : (
          <SupplyTable supplies={pagedSupplies} getRowActions={getRowActions} />
        )}

        {!isLoading && !error && supplies.length > 0 && (
          <Pagination
            page={page}
            limit={perPage}
            total={total}
            itemLabelPlural="produtos"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insumos & Produtos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Catálogo unificado de insumos de produção e produtos comercializáveis.
          </p>
        </div>
        <Button className="gap-2 shrink-0" onClick={() => openDialog('create')}>
          <Plus className="h-4 w-4" />
          Novo Item
        </Button>
      </div>

      {/* Stats */}
      <SupplyCatalogStatsCards stats={stats} />

      {/* Table card */}
      <Card>
        <CardHeader className="flex-row justify-between   px-5 py-4">
          <CardTitle className="text-base">Lista de Lotes</CardTitle>
          <Tabs
            value={typeFilter}
            onValueChange={(v) => {
              setTypeFilter(v);
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="insumos">Insumos</TabsTrigger>
              <TabsTrigger value="produtos">Produtos</TabsTrigger>
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
                placeholder="Buscar por nome, SKU ou fornecedor..."
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5A4]"
            >
              <option value="">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5A4]"
            >
              <option value="">Todos status</option>
              <option value="active">Ativo</option>
              <option value="below_minimum">Estoque Baixo</option>
            </select>
          </div>

          <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {renderContent()}
          </main>
        </CardContent>
      </Card>

      <SupplyDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedSupply(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        supply={selectedSupply}
        onSuccess={() => setDialogOpen(false)}
      />
    </div>
  );
}
