'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  STATUS_LABELS,
  type Transfer,
  type TransferDialogMode,
  type TransferListResponse,
  type TransferStatus,
} from '../types';
import { TransferTable } from './TransferTable';
import { TransferDialog } from './TransferDialog';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import {
  ListEmptyState,
  ListErrorState,
  ListLoadingState,
} from '@/shared/components/states/ListStates';
import {
  ArrowLeftRight,
  ArrowRightLeft,
  Boxes,
  CalendarClock,
  Eye,
  Pencil,
  Scale,
  Trash,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';
import { formatNumber } from '@/shared/utils/numberFormat';
import type { DataTableAction } from '@/shared/components/Table';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/Select';
import { Select } from '@/src/shared/components/ui';

export type TransfersListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: TransferListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  transfers: Transfer[];
  total: number;
  limit: number;
  handleDelete: (id: string) => void;
  isDeleting: boolean;
};

export function TransfersListView({
  page,
  setPage,
  search,
  setSearch,
  data,
  isLoading,
  error,
  transfers,
  total,
  limit,
  handleDelete,
  isDeleting,
}: Readonly<TransfersListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<TransferDialogMode>('create');
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [batchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return transfers
      .filter((t) => {
        const q = search.toLowerCase();
        const matchesSearch =
          !search ||
          (t.batchName ?? '').toLowerCase().includes(q) ||
          (t.originTankName ?? '').toLowerCase().includes(q) ||
          (t.destinationTankName ?? '').toLowerCase().includes(q) ||
          (t.responsible ?? '').toLowerCase().includes(q);
        const matchesBatch = batchFilter === 'all' || t.batchId === batchFilter;
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesBatch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = a.transferDate ?? a.createdAt ?? '';
        const dateB = b.transferDate ?? b.createdAt ?? '';
        return dateB.localeCompare(dateA);
      });
  }, [transfers, search, batchFilter, statusFilter]);

  const stats = useMemo(() => {
    const completed = transfers.filter((t) => t.status === 'completed');
    const totalIndividuals = completed.reduce((acc, t) => acc + t.quantity, 0);
    const totalBiomassKg = completed.reduce(
      (acc, t) => acc + (t.quantity * (t.averageWeight ?? 0)) / 1000,
      0,
    );
    return {
      total: transfers.length,
      totalIndividuals,
      totalBiomassKg,
      scheduled: transfers.filter((t) => t.status === 'scheduled').length,
    };
  }, [transfers]);

  const openDialog = useCallback((mode: TransferDialogMode, transfer: Transfer | null = null) => {
    setDialogMode(mode);
    setSelectedTransfer(transfer);
    setDialogOpen(true);
  }, []);

  const getRowActions = useCallback(
    (row: Transfer): DataTableAction[] => [
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
        variant: 'danger' as const,
        disabled: isDeleting,
        icon: <Trash className="h-4 w-4" />,
      },
    ],
    [handleDelete, isDeleting, openDialog],
  );

  const renderContent = () => {
    if (isLoading) return <ListLoadingState />;

    if (error) {
      return (
        <ListErrorState
          title="Erro ao carregar transferências"
          message="Não foi possível carregar as transferências. Tente novamente mais tarde."
        />
      );
    }

    if (!filtered.length) {
      return (
        <ListEmptyState
          title={
            search || batchFilter !== 'all' || statusFilter !== 'all'
              ? 'Nenhuma transferência encontrada com os filtros aplicados.'
              : 'Nenhuma transferência cadastrada.'
          }
          subtitle={
            search || batchFilter !== 'all' || statusFilter !== 'all'
              ? 'Tente alterar os filtros.'
              : 'Clique em Nova Transferência para criar a primeira.'
          }
        />
      );
    }

    return (
      <>
        <TransferTable transfers={filtered} getRowActions={getRowActions} />

        {data && total > limit && (
          <Pagination
            page={page}
            limit={limit}
            total={total}
            itemLabelPlural="transferências"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <ListHeader
        icon={<ArrowLeftRight className="h-8 w-8 text-[#0EA5A4]" />}
        title="Transferências"
        subtitle="Movimente lotes entre tanques com rastreabilidade e controle de biomassa."
        dialogOpen
        dialogLabel="Nova Transferência"
        setDialogOpen={() => openDialog('create')}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">movimentações</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Indivíduos Movidos</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalIndividuals)}</div>
            <p className="text-xs text-muted-foreground">somente concluídas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Biomassa (kg)</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalBiomassKg, { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">total transferida</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">aguardando execução</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Transferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <SearchField
              search={search}
              setSearch={setSearch}
              setCurrentPage={setPage}
              placeholder="Buscar por lote, tanque ou responsável..."
            />
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {(Object.entries(STATUS_LABELS) as [TransferStatus, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {renderContent()}
        </CardContent>
      </Card>

      <TransferDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedTransfer(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        transfer={selectedTransfer}
        onSuccess={() => {
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
