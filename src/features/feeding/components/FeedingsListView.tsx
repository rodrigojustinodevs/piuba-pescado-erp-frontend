'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Feeding, FeedingDialogMode, FeedingListResponse } from '../types';
import { FeedingDialog } from './FeedingDialog';
import { FeedingTable, getFeedingRowLabel } from './FeedingTable';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import { SpinnerIcon } from '@/shared/components/icons/AppIcons';
import { Calendar, Eye, Fish, Package, Pencil, Scale, Trash, Utensils } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';
import { formatNumber } from '@/src/shared/utils/numberFormat';
import { isToday } from '@/src/shared/utils/dateFormat';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/Select';
import { FEED_TYPE_OPTIONS } from '../constants';

export type FeedingsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  data: FeedingListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  feedings: Feeding[];
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

export function FeedingsListView({
  page,
  setPage,
  search,
  setSearch,
  data,
  isLoading,
  error,
  feedings,
  handleDelete,
  isDeleting,
}: Readonly<FeedingsListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<FeedingDialogMode>('create');
  const [selectedFeeding, setSelectedFeeding] = useState<Feeding | null>(null);
  const [feedTypeFilter, setFeedTypeFilter] = useState('all');

  const openFeedingDialog = useCallback(
    (mode: FeedingDialogMode, feeding: Feeding | null = null) => {
      setDialogMode(mode);
      setSelectedFeeding(feeding);
      setDialogOpen(true);
    },
    [],
  );

  const stats = useMemo(() => {
    const total = feedings.reduce((acc, a) => acc + a.quantityProvided, 0);
    const todayItems = feedings.filter((a) => isToday(a.feedingDate));
    const todayTotal = todayItems.reduce((acc, a) => acc + a.quantityProvided, 0);
    const stockUsed = feedings.reduce((acc, a) => acc + a.stockReductionQuantity, 0);
    return {
      totalRegisters: feedings.length,
      totalKg: total,
      todayKg: todayTotal,
      todayCount: todayItems.length,
      stockUsed,
    };
  }, [feedings]);

  const handleFeedingDelete = useCallback(
    (id: string, label: string) => {
      handleDelete(id, label);
    },
    [handleDelete],
  );

  const getRowActions = useCallback(
    (feeding: Feeding) => [
      {
        label: 'Ver detalhes',
        onClick: () => openFeedingDialog('view', feeding),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openFeedingDialog('edit', feeding),
        icon: <Pencil className="h-4 w-4" />,
      },
      {
        label: 'Excluir',
        onClick: () => handleFeedingDelete(feeding.id, getFeedingRowLabel(feeding)),
        disabled: isDeleting,
        variant: 'danger' as const,
        icon: <Trash className="h-4 w-4" />,
      },
    ],
    [handleFeedingDelete, isDeleting, openFeedingDialog],
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
      return <div className="p-8 text-center text-red-600">Erro ao carregar alimentações.</div>;
    }

    if (!feedings.length) {
      const emptyTitle = search
        ? 'Nenhuma alimentação encontrada com os filtros aplicados.'
        : 'Nenhuma alimentação cadastrada.';
      const emptySubtitle = search
        ? 'Tente alterar a busca.'
        : 'Clique em Nova Alimentação para criar o primeiro.';
      return (
        <div className="p-8 text-center text-slate-500">
          <p className="text-base">{emptyTitle}</p>
          <p className="mt-1 text-sm">{emptySubtitle}</p>
        </div>
      );
    }

    return (
      <>
        <FeedingTable feedings={feedings} getRowActions={getRowActions} />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="alimentações"
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
        title="Alimentação"
        subtitle="Registre e acompanhe o fornecimento de ração aos lotes."
        dialogOpen
        dialogLabel="Nova Alimentação"
        setDialogOpen={(open) => {
          if (open) openFeedingDialog('create');
        }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Registros</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRegisters}</div>
            <p className="text-xs text-muted-foreground">total no histórico</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.todayKg)} kg</div>
            <p className="text-xs text-muted-foreground">{stats.todayCount} fornecimentos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Fornecido</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalKg)} kg</div>
            <p className="text-xs text-muted-foreground">acumulado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixado</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.stockUsed)} kg</div>
            <p className="text-xs text-muted-foreground">via integração</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Alimentação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchField
                search={search}
                setSearch={setSearch}
                setCurrentPage={setPage}
                placeholder="Buscar por lote, tipo ou observações..."
              />
            </div>
            <Select
              value={feedTypeFilter}
              onValueChange={(v) => {
                setFeedTypeFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {FEED_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {renderContent()}
        </CardContent>
      </Card>

      <FeedingDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedFeeding(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        feeding={selectedFeeding}
        onSuccess={() => {
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
