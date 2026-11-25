'use client';

import { useCallback, useEffect, useState } from 'react';
import { Activity, CirclePause, Droplets, Wrench } from 'lucide-react';
import type { Tank, TankListResponse, TankDialogMode } from '../types';
import type { StatusFilter } from '@/shared/hooks/useListPageState';
import { TankCards } from './TankCards';
import { TankDialog } from './TankDialog';
import { TankDetailsDialog } from './TankDetailsDialog';
import { useTankTypes } from '../hooks/useTankTypes';
import { TANK_STATUS_FILTER_OPTIONS } from '../utils/tankDisplayLabels';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import {
  ListEmptyState,
  ListErrorState,
  ListLoadingState,
} from '@/shared/components/states/ListStates';
import { StatCard } from '@/shared/components/Cards/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { useAuthContext } from '@/shared/contexts/AuthContext';

export type TanksListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  filter: StatusFilter;
  setFilter: (next: StatusFilter) => void;
  tankTypeFilter: string;
  setTankTypeFilter: (next: string) => void;
  data: TankListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  filteredTanks: Tank[];
  stats: {
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
  };
  handleDelete: (id: string, name: string) => void;
  isDeleting: boolean;
  autoOpenCreate?: boolean;
};

export function TanksListView({
  page,
  setPage,
  search,
  setSearch,
  filter,
  setFilter,
  tankTypeFilter,
  setTankTypeFilter,
  data,
  isLoading,
  error,
  filteredTanks,
  stats,
  handleDelete,
  isDeleting,
  autoOpenCreate = false,
}: Readonly<TanksListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<TankDialogMode>('create');
  const [selectedTank, setSelectedTank] = useState<Tank | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTank, setDetailsTank] = useState<Tank | null>(null);
  const { isMaster } = useAuthContext();
  const { data: tankTypesData } = useTankTypes();
  const tankTypes = tankTypesData?.tankTypes ?? [];

  const openTankDialog = useCallback((mode: TankDialogMode, tank: Tank | null = null) => {
    if (mode === 'view') {
      setDetailsTank(tank);
      setDetailsOpen(true);
      return;
    }
    setDialogMode(mode);
    setSelectedTank(tank);
    setDialogOpen(true);
  }, []);

  const handleEditFromDetails = useCallback(
    (tank: Tank) => {
      setDetailsOpen(false);
      openTankDialog('edit', tank);
    },
    [openTankDialog],
  );

  useEffect(() => {
    if (autoOpenCreate) {
      openTankDialog('create');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenCreate]);

  const renderContent = () => {
    if (isLoading) return <ListLoadingState />;
    if (error)
      return (
        <ListErrorState
          title="Erro ao carregar tanques"
          message="Não foi possível carregar os tanques. Tente novamente."
        />
      );
    if (!filteredTanks.length) return <ListEmptyState title="Nenhum tanque encontrado." />;

    return (
      <>
        <TankCards
          tanks={filteredTanks}
          isMaster={isMaster()}
          isDeleting={isDeleting}
          openTankDialog={openTankDialog}
          onDelete={handleDelete}
        />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="tanques"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <ListHeader
        icon={<Droplets className="h-8 w-8 text-[#0EA5A4]" />}
        title="Tanques"
        subtitle="Gerencie e acompanhe os tanques cadastrados"
        dialogOpen
        dialogLabel="Novo Tanque"
        setDialogOpen={() => openTankDialog('create')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de Tanques"
          value={stats.total}
          icon={<Droplets className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
        />
        <StatCard
          label="Ativos"
          value={stats.active}
          icon={<Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
        />
        <StatCard
          label="Inativos"
          value={stats.inactive}
          icon={<CirclePause className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
        />
        <StatCard
          label="Em Manutenção"
          value={stats.maintenance}
          icon={<Wrench className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de Tanques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchField
                search={search}
                setSearch={setSearch}
                setCurrentPage={setPage}
                placeholder="Buscar por nome, tipo ou localização…"
              />
            </div>
            <Select value={tankTypeFilter} onValueChange={setTankTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filtrar por tipo">
                <SelectValue placeholder="Tipo de Tanque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                {tankTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filter} onValueChange={(v) => setFilter(v as StatusFilter)}>
              <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filtrar por status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {TANK_STATUS_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {renderContent()}
        </CardContent>
      </Card>

      <TankDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedTank(null);
          setDialogOpen(open);
        }}
        onSuccess={() => setDialogOpen(false)}
        mode={dialogMode}
        tank={selectedTank}
      />

      <TankDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        tank={detailsTank}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
}
