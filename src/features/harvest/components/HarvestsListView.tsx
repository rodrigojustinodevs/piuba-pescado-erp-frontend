'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Harvest, HarvestDialogMode, HarvestListResponse, HarvestStatus } from '../types';
import { HARVEST_STATUS_LABELS } from '../types';
import { HarvestTable } from './HarvestTable';
import { HarvestDialog } from './HarvestDialog';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import {
  ListEmptyState,
  ListErrorState,
  ListLoadingState,
} from '@/shared/components/states/ListStates';
import { DollarSign, Fish, Percent, Scale, TrendingUp, Waves } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';
import { StatCard } from '@/shared/components/Cards';
import { formatNumber } from '@/shared/utils/numberFormat';
import type { DataTableAction } from '@/shared/components/Table';
import { createStandardRowActions } from '@/shared/utils/rowActions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/Select';

export type HarvestsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: HarvestListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  harvests: Harvest[];
  total: number;
  limit: number;
  handleDelete: (id: string) => void;
  isDeleting: boolean;
};

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export function HarvestsListView({
  page,
  setPage,
  search,
  setSearch,
  data,
  isLoading,
  error,
  harvests,
  total,
  limit,
  handleDelete,
  isDeleting,
}: Readonly<HarvestsListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<HarvestDialogMode>('create');
  const [selectedHarvest, setSelectedHarvest] = useState<Harvest | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return harvests
      .filter((h) => {
        const q = search.toLowerCase();
        const matchesSearch =
          !search ||
          (h.batchName ?? '').toLowerCase().includes(q) ||
          (h.tankName ?? '').toLowerCase().includes(q) ||
          (h.responsible ?? '').toLowerCase().includes(q) ||
          (h.clientDestination ?? '').toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.harvestDate.localeCompare(a.harvestDate));
  }, [harvests, search, statusFilter]);

  const stats = useMemo(() => {
    const totalBiomass = harvests.reduce(
      (acc, h) => acc + (h.harvestedQuantity * h.averageWeight) / 1000,
      0,
    );
    const totalRevenue = harvests.reduce((acc, h) => {
      return (
        acc +
        (h.sizeClassifications ?? []).reduce(
          (s, c) => s + ((c.quantity * c.averageWeight) / 1000) * c.pricePerKg,
          0,
        )
      );
    }, 0);
    const totalNetProfit = harvests.reduce((acc, h) => {
      const rev = (h.sizeClassifications ?? []).reduce(
        (s, c) => s + ((c.quantity * c.averageWeight) / 1000) * c.pricePerKg,
        0,
      );
      return acc + rev - (h.operationalCost ?? 0);
    }, 0);
    const countScheduled = harvests.filter((h) => h.status === 'scheduled').length || 0;
    const survivalRates = harvests.map((h) => {
      if (!h.initialPopulation) return 0;
      return Math.min(100, (h.harvestedQuantity / h.initialPopulation) * 100);
    });
    const averageSurvivalRate =
      survivalRates.reduce((acc, r) => acc + r, 0) / (survivalRates.length || 1);
    return {
      total: harvests.length,
      totalBiomass,
      totalRevenue,
      totalNetProfit,
      countScheduled,
      averageSurvivalRate,
    };
  }, [harvests]);

  const openDialog = useCallback((mode: HarvestDialogMode, harvest: Harvest | null = null) => {
    setDialogMode(mode);
    setSelectedHarvest(harvest);
    setDialogOpen(true);
  }, []);

  const getRowActions = useCallback(
    (row: Harvest): DataTableAction[] =>
      createStandardRowActions(
        () => openDialog('view', row),
        () => openDialog('edit', row),
        () => handleDelete(row.id),
        isDeleting,
      ),
    [handleDelete, isDeleting, openDialog],
  );

  const renderContent = () => {
    if (isLoading) return <ListLoadingState />;
    if (error) {
      return (
        <ListErrorState
          title="Erro ao carregar despescas"
          message="Não foi possível carregar as despescas. Tente novamente mais tarde."
        />
      );
    }
    if (!filtered.length) {
      return (
        <ListEmptyState
          title={
            search || statusFilter !== 'all'
              ? 'Nenhuma despesca encontrada com os filtros aplicados.'
              : 'Nenhuma despesca cadastrada.'
          }
          subtitle={
            search || statusFilter !== 'all'
              ? 'Tente alterar os filtros.'
              : 'Clique em Nova Despesca para registrar a primeira.'
          }
        />
      );
    }
    return (
      <>
        <HarvestTable harvests={filtered} getRowActions={getRowActions} />
        {data && total > limit && (
          <Pagination
            page={page}
            limit={limit}
            total={total}
            itemLabelPlural="despescas"
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
        title="Despescas"
        subtitle="Gerencie as despescas com controle de biomassa, classificação por tamanho e resultado financeiro."
        dialogOpen
        dialogLabel="Nova Despesca"
        setDialogOpen={() => openDialog('create')}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Despescas"
          icon={<Waves className="h-4 w-4 text-muted-foreground" />}
          value={stats.total}
          subtitle={`${stats.countScheduled} agendadas`}
        />
        <StatCard
          label="Biomassa Total"
          icon={<Scale className="h-4 w-4 text-muted-foreground" />}
          value={formatNumber(stats.totalBiomass, { maximumFractionDigits: 2 })}
          subtitle="kg despescados"
        />
        <StatCard
          label="Receita"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          value={fmtCurrency(stats.totalRevenue)}
          subtitle="bruta concluídas"
        />
        <StatCard
          label="Lucro Líquido"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          value={fmtCurrency(stats.totalNetProfit)}
          subtitle="após custos operacionais"
          valueClassName={stats.totalNetProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}
        />
        <StatCard
          label="Sobrevivência"
          icon={<Percent className="h-4 w-4 text-muted-foreground" />}
          value={`${fmtCurrency(stats.averageSurvivalRate)} %`}
          subtitle="taxa de sobrevivência média"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Despescas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <SearchField
              search={search}
              setSearch={setSearch}
              setCurrentPage={setPage}
              placeholder="Buscar por lote, tanque, responsável ou cliente..."
            />
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {(Object.entries(HARVEST_STATUS_LABELS) as [HarvestStatus, string][]).map(
                  ([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          {renderContent()}
        </CardContent>
      </Card>

      <HarvestDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedHarvest(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        harvest={selectedHarvest}
        onSuccess={() => setDialogOpen(false)}
      />
    </div>
  );
}
