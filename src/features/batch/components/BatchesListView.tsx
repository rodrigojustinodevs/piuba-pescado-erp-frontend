'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Batch, BatchCultivation, BatchDialogMode, BatchesListViewProps } from '../types';
import { BatchTable } from './BatchTable';
import { BatchCreateDialog } from './BatchCreateDialog';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import { SpinnerIcon } from '@/shared/components/icons/AppIcons';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { CheckCircle2, Eye, Fish, Package, Pencil, Sprout, Trash } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/Select';
import { formatNumber } from '@/shared/utils/numberFormat';

export function BatchesListView({
  page,
  setPage,
  search,
  setSearch,
  filter,
  data,
  isLoading,
  error,
  filteredBatches,
  stats,
  handleDelete,
  isDeleting,
}: Readonly<BatchesListViewProps>) {
  const cultivationLabels: Record<BatchCultivation, string> = {
    growout: 'Engorda',
    daycare: 'Berçário',
    nursery: 'Berçário',
    broodstock: 'Reprodução',
    larviculture: 'Larvicultura',
  };

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cultivationFilter, setCultivationFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<BatchDialogMode>('create');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const openBatchDialog = useCallback((mode: BatchDialogMode, batch: Batch | null = null) => {
    setDialogMode(mode);
    setSelectedBatch(batch);
    setDialogOpen(true);
  }, []);

  const speciesList = useMemo(() => {
    return Array.from(new Set(data?.batches.map((b) => b.species) ?? []));
  }, [data?.batches]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data?.batches.filter((b) => {
      const matchSearch =
        !term ||
        b.name?.toLowerCase().includes(term) ||
        b.species.toLowerCase().includes(term) ||
        b.description?.toLowerCase().includes(term);
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchCultivation = cultivationFilter === 'all' || b.cultivation === cultivationFilter;
      return matchSearch && matchStatus && matchCultivation;
    });
  }, [search, statusFilter, cultivationFilter, data?.batches]);
  const visibleBatches = filtered ?? filteredBatches;

  const getRowActions = useCallback(
    (batch: Batch) => [
      {
        label: 'Ver detalhes',
        onClick: () => openBatchDialog('view', batch),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openBatchDialog('edit', batch),
        icon: <Pencil className="h-4 w-4" />,
      },
      {
        label: 'Excluir',
        onClick: () => handleDelete(batch.id, batch.species),
        disabled: isDeleting,
        variant: 'danger' as const,
        icon: <Trash className="h-4 w-4" />,
      },
    ],
    [handleDelete, isDeleting, openBatchDialog],
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
          Erro ao carregar lotes. Tente novamente mais tarde.
        </div>
      );
    }

    if (!visibleBatches.length) {
      return (
        <div className="p-8 text-center text-slate-500">
          <p className="text-base">
            {search || filter !== 'all'
              ? 'Nenhum lote encontrado com os filtros aplicados.'
              : 'Nenhum lote cadastrado.'}
          </p>
          <p className="mt-1 text-sm">
            {search || filter !== 'all'
              ? 'Tente alterar a busca ou os filtros.'
              : 'Clique em Novo Lote para criar o primeiro.'}
          </p>
        </div>
      );
    }

    return (
      <>
        <BatchTable
          batches={visibleBatches}
          cultivationLabels={cultivationLabels}
          getRowActions={getRowActions}
        />

        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="lotes"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <ListHeader
        icon={<Fish className="h-8 w-8 text-[#0EA5A4]" />}
        title="Lotes"
        subtitle="Gerencie os lotes de cultivo da sua produção."
        dialogOpen
        dialogLabel="Novo Lote"
        setDialogOpen={() => openBatchDialog('create')}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Lotes
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.batches.filter((b) => b.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Animais Ativos
            </CardTitle>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(
                data?.batches
                  .filter((b) => b.status === 'active')
                  .reduce((s, b) => s + b.initialQuantity, 0) ?? 0,
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Espécies</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{speciesList.length}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de Lotes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchField
                search={search}
                setSearch={setSearch}
                setCurrentPage={setPage}
                placeholder="Buscar por nome, espécie, tanque..."
              />
            </div>
            <Select
              value={cultivationFilter}
              onValueChange={(v) => {
                setCultivationFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="md:w-56">
                <SelectValue placeholder="Tipo de cultivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cultivos</SelectItem>
                {(Object.keys(cultivationLabels) as BatchCultivation[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {cultivationLabels[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="md:w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="harvested">Despescado</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {renderContent()}
          </main>
        </CardContent>
      </Card>
      <BatchCreateDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedBatch(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        batch={selectedBatch}
        onSuccess={() => {
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
