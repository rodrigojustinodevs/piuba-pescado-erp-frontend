'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Biometry, BiometryDialogMode, BiometryListResponse } from '../types';
import { BiometryTable } from './BiometryTable';
import { BiometryDialog } from './BiometryDialog';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import { SpinnerIcon } from '@/shared/components/icons/AppIcons';
import { Activity, Eye, FingerprintPattern, Pencil, Ruler, Scale, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';
import { formatNumber } from '@/src/shared/utils/numberFormat';

function toFiniteNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function arithmeticMean(values: number[]): number {
  if (!values.length) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
}

export type BiometriesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  data: BiometryListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  biometries: Biometry[];
};

export function BiometriesListView({
  page,
  setPage,
  search,
  setSearch,
  data,
  isLoading,
  error,
  biometries,
}: Readonly<BiometriesListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<BiometryDialogMode>('create');
  const [selectedBiometry, setSelectedBiometry] = useState<Biometry | null>(null);

  const openBiometryDialog = useCallback(
    (mode: BiometryDialogMode, biometry: Biometry | null = null) => {
      setDialogMode(mode);
      setSelectedBiometry(biometry);
      setDialogOpen(true);
    },
    [],
  );

  const stats = useMemo(() => {
    const weights = biometries.map((b) => toFiniteNumber(b.averageWeight));
    const fcrs = biometries.map((b) => toFiniteNumber(b.fcr));
    const batchIds = biometries.map((b) => b.batchId).filter(Boolean);
    return {
      total: biometries.length,
      lotesMonitorados: new Set(batchIds).size,
      avgWeight: arithmeticMean(weights),
      avgFcr: arithmeticMean(fcrs),
    };
  }, [biometries]);
  const getRowActions = useCallback(
    (row: Biometry) => [
      {
        label: 'Ver detalhes',
        onClick: () => openBiometryDialog('view', row),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openBiometryDialog('edit', row),
        icon: <Pencil className="h-4 w-4" />,
      },
    ],
    [openBiometryDialog],
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
      return <div className="p-8 text-center text-red-600">Erro ao carregar biometrias.</div>;
    }

    if (!biometries.length) {
      return <div className="p-8 text-center text-slate-500">Nenhuma biometria encontrada.</div>;
    }

    return (
      <>
        <BiometryTable biometries={biometries} getRowActions={getRowActions} />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="biometrias"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <ListHeader
        icon={<FingerprintPattern className="h-8 w-8 text-[#0EA5A4]" />}
        title="Biometrias"
        subtitle="Acompanhe o crescimento dos lotes através de amostragens periódicas."
        dialogOpen
        dialogLabel="Nova Biometria"
        setDialogOpen={() => openBiometryDialog('create')}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">biometrias realizadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lotes Monitorados</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lotesMonitorados}</div>
            <p className="text-xs text-muted-foreground">com biometrias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Peso Médio</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.avgWeight, { maximumFractionDigits: 3 })} g
            </div>
            <p className="text-xs text-muted-foreground">média geral</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">FCR Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.avgFcr, { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">conversão alimentar</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Biometrias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <SearchField
              search={search}
              setSearch={setSearch}
              setCurrentPage={setPage}
              placeholder="Buscar por lote..."
            />
          </div>
          {renderContent()}
        </CardContent>
      </Card>

      <BiometryDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedBiometry(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        biometry={selectedBiometry}
        onSuccess={() => {
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
