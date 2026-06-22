'use client';

import { useCallback, useState } from 'react';
import type { Stocking, StockingDialogMode, StockingListResponse } from '../types';
import { StockingCreateDialog } from './StockingCreateDialog';
import { StockingTable, getStockingRowLabel } from './StockingTable';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import { SpinnerIcon } from '@/shared/components/icons/AppIcons';
import { CheckCircle2, Eye, Fish, Pencil, Scale, Shrimp, Sprout, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';
import { formatNumber } from '@/src/shared/utils/numberFormat';

export type StockingsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  data: StockingListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  stockings: Stocking[];
  total: number;
  limit: number;
  batchMap: Record<string, string>;
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
  stats: {
    total: number;
    active: number;
    totalQuantity: number;
    totalBiomass: number;
    totalCost: number;
  };
};

export function StockingsListView({
  page,
  setPage,
  search,
  setSearch,
  data,
  isLoading,
  error,
  stockings,
  total,
  limit,
  batchMap,
  stats,
  handleDelete,
  isDeleting,
}: Readonly<StockingsListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<StockingDialogMode>('create');
  const [selectedStocking, setSelectedStocking] = useState<Stocking | null>(null);

  const openStockingDialog = useCallback(
    (mode: StockingDialogMode, stocking: Stocking | null = null) => {
      setDialogMode(mode);
      setSelectedStocking(stocking);
      setDialogOpen(true);
    },
    [],
  );

  const handleStockingDelete = useCallback(
    (id: string, label: string) => {
      handleDelete(id, label);
    },
    [handleDelete],
  );

  const getRowActions = useCallback(
    (stocking: Stocking) => [
      {
        label: 'Ver detalhes',
        onClick: () => openStockingDialog('view', stocking),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openStockingDialog('edit', stocking),
        icon: <Pencil className="h-4 w-4" />,
      },
      {
        label: 'Excluir',
        onClick: () => handleStockingDelete(stocking.id, getStockingRowLabel(stocking, batchMap)),
        disabled: isDeleting,
        variant: 'danger' as const,
        icon: <Trash className="h-4 w-4" />,
      },
    ],
    [batchMap, handleStockingDelete, isDeleting, openStockingDialog],
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <SpinnerIcon className="w-5 h-5 animate-spin" />
            <span>Carregando...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 text-center text-red-600">
          Erro ao carregar povoamentos. Tente novamente mais tarde.
        </div>
      );
    }

    if (!stockings.length) {
      const emptyTitle = search
        ? 'Nenhum povoamento encontrado com os filtros aplicados.'
        : 'Nenhum povoamento cadastrado.';
      const emptySubtitle = search
        ? 'Tente alterar a busca.'
        : 'Clique em Novo Povoamento para criar o primeiro.';
      return (
        <div className="p-8 text-center text-slate-500">
          <p className="text-base">{emptyTitle}</p>
          <p className="mt-1 text-sm">{emptySubtitle}</p>
        </div>
      );
    }

    return (
      <>
        <StockingTable stockings={stockings} batchMap={batchMap} getRowActions={getRowActions} />

        {data && total > limit && (
          <Pagination
            page={page}
            limit={limit}
            total={total}
            itemLabelPlural="povoamentos"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <ListHeader
        icon={<Shrimp className="h-8 w-8 text-[#0EA5A4]" />}
        title="Povoamentos"
        subtitle="Gerencie e acompanhe os povoamentos de lotes"
        dialogOpen
        dialogLabel="Novo Povoamento"
        setDialogOpen={() => openStockingDialog('create')}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.active} ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quantidade Atual</CardTitle>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalQuantity)}</div>
            <p className="text-xs text-muted-foreground">indivíduos ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Biomassa Estimada</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(Math.round(stats.totalBiomass))} kg
            </div>
            <p className="text-xs text-muted-foreground">total ativo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Custo Acumulado</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalCost)}</div>
            <p className="text-xs text-muted-foreground">custos fixos totais</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de Povoamentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <SearchField
                search={search}
                setSearch={setSearch}
                setCurrentPage={setPage}
                placeholder="Buscar povoamento..."
              />
            </div>
          </div>
          {renderContent()}
        </CardContent>
      </Card>

      <StockingCreateDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedStocking(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        stocking={selectedStocking}
        batchMap={batchMap}
        onSuccess={() => {
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
