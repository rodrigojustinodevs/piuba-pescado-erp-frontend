'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  CAUSE_LABELS,
  SEVERITY_LABELS,
  type Mortality,
  type MortalityDialogMode,
  type MortalityListResponse,
} from '../types';
import { MortalityTable } from './MortalityTable';
import { MortalityDialog } from './MortalityDialog';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import { SpinnerIcon } from '@/shared/components/icons/AppIcons';
import { Activity, Eye, HeartPulse, Pencil, Skull, Trash, TrendingDown } from 'lucide-react';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { formatNumber } from '@/shared/utils/numberFormat';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';
import { Select } from '@/src/shared/components/ui';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/Select';

export type MortalitiesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: MortalityListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  mortalities: Mortality[];
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

function rowLabel(row: Mortality): string {
  return `${row.batch?.name || 'Lote'} - ${formatNullableDatePtBR(row.mortalityDate)}`;
}

export function MortalitiesListView({
  page,
  setPage,
  search,
  setSearch,
  setSortBy,
  data,
  isLoading,
  error,
  mortalities,
  handleDelete,
  isDeleting,
}: Readonly<MortalitiesListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<MortalityDialogMode>('create');
  const [selectedMortality, setSelectedMortality] = useState<Mortality | null>(null);
  const [causeFilter, setCauseFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredMortalities = useMemo(() => {
    return mortalities.filter((m) => {
      const matchesCause = causeFilter === 'all' || m.cause === causeFilter;
      const matchesSeverity = severityFilter === 'all' || m.severity === severityFilter;
      return matchesCause && matchesSeverity;
    });
  }, [mortalities, causeFilter, severityFilter]);

  const stats = useMemo(() => {
    const totalDeaths = filteredMortalities.reduce((acc, m) => acc + m.quantity, 0);
    const totalInitial = mortalities.reduce((acc, m) => acc + (m.batch?.initialQuantity ?? 0), 0);
    const overallRate = totalInitial > 0 ? (totalDeaths / totalInitial) * 100 : 0;
    const criticalCount = filteredMortalities.filter((m) => m.severity === 'critical').length;

    const causeCount: Record<string, number> = {};
    for (const m of mortalities) causeCount[m.cause] = (causeCount[m.cause] ?? 0) + m.quantity;
    const topCause = Object.entries(causeCount).sort((a, b) => b[1] - a[1])[0];

    return {
      totalRecords: filteredMortalities.length,
      totalDeaths,
      criticalCount,
      overallRate,
      topCauseLabel: topCause ? CAUSE_LABELS[topCause[0] as keyof typeof CAUSE_LABELS] : '—',
    };
  }, [mortalities, filteredMortalities]);

  const openMortalityDialog = useCallback(
    (mode: MortalityDialogMode, mortality: Mortality | null = null) => {
      setDialogMode(mode);
      setSelectedMortality(mortality);
      setDialogOpen(true);
    },
    [],
  );

  const getRowActions = useCallback(
    (row: Mortality) => [
      {
        label: 'Ver detalhes',
        onClick: () => openMortalityDialog('view', row),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openMortalityDialog('edit', row),
        icon: <Pencil className="h-4 w-4" />,
      },
      {
        label: 'Excluir',
        onClick: () => handleDelete(row.id, rowLabel(row)),
        disabled: isDeleting,
        variant: 'danger' as const,
        icon: <Trash className="h-4 w-4" />,
      },
    ],
    [handleDelete, isDeleting, openMortalityDialog],
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
      return <div className="p-8 text-center text-red-600">Erro ao carregar mortalidades.</div>;
    }

    if (!filteredMortalities.length) {
      return (
        <div className="p-8 text-center text-slate-500">
          Nenhum registro de mortalidade encontrado.
        </div>
      );
    }

    return (
      <>
        <MortalityTable mortalities={filteredMortalities} getRowActions={getRowActions} />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="registros"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  const handleSort = useCallback((next: string) => setSortBy(next), [setSortBy]);

  return (
    <div className="space-y-6">
      <ListHeader
        icon={
          <svg
            className="h-8 w-8 text-[#0EA5A4]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            />
          </svg>
        }
        title="Mortalidades"
        subtitle="Acompanhe perdas, identifique padrões e proteja a saúde dos seus lotes."
        dialogOpen
        dialogLabel="Registrar Mortalidade"
        setDialogOpen={() => openMortalityDialog('create')}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecords}</div>
            <p className="text-xs text-muted-foreground">ocorrências</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Indivíduos Perdidos</CardTitle>
            <Skull className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalDeaths)}</div>
            <p className="text-xs text-muted-foreground">somando todos os lotes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa Geral</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.overallRate > 0 ? `${stats.overallRate.toFixed(1)}%` : '—'}
            </div>
            <p className="text-xs text-muted-foreground">sobre quantidade inicial</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Causa Predominante</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topCauseLabel}</div>
            <p className="text-xs text-muted-foreground">{stats.criticalCount} crítica(s)</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Mortalidades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <SearchField
              search={search}
              setSearch={setSearch}
              setCurrentPage={setPage}
              placeholder="Buscar por lote..."
            />
            <Select
              value={causeFilter}
              onValueChange={(v) => {
                setCauseFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Causa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as causas</SelectItem>
                {Object.entries(CAUSE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={severityFilter}
              onValueChange={(v) => {
                setSeverityFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Severidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Severidades</SelectItem>
                {Object.entries(SEVERITY_LABELS).map(([k, v]) => (
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

      <MortalityDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedMortality(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        mortality={selectedMortality}
        onSuccess={() => {
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
