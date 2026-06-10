'use client';

import { useCallback, useState } from 'react';
import type { Tank, TankListResponse, TankDialogMode } from '../types';
import { TankTable } from './TankTable';
import { TankDialog } from './TankDialog';
import { ListHeader, Pagination, SearchField, StatusFilterTabs } from '@/shared/components/list';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Building, Droplets, Eye, Pencil, Trash, Loader2 } from 'lucide-react';
type TankFilter = 'all' | 'active' | 'inactive';

export type TanksListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  filter: TankFilter;
  setFilter: (next: TankFilter) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: TankListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  filteredTanks: Tank[];
  stats: {
    total: number;
    inactive: number;
  };
  handleDelete: (id: string, name: string) => void;
  isDeleting: boolean;
};

export function TanksListView({
  page,
  setPage,
  search,
  setSearch,
  filter,
  setFilter,
  data,
  isLoading,
  error,
  filteredTanks,
  stats,
  handleDelete,
  isDeleting,
}: Readonly<TanksListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<TankDialogMode>('create');
  const [selectedTank, setSelectedTank] = useState<Tank | null>(null);

  const openTankDialog = useCallback((mode: TankDialogMode, tank: Tank | null = null) => {
    setDialogMode(mode);
    setSelectedTank(tank);
    setDialogOpen(true);
  }, []);

  const handleTankDelete = useCallback(
    (id: string, name: string) => {
      handleDelete(id, name);
    },
    [handleDelete],
  );

  const getRowActions = useCallback(
    (tank: Tank) => [
      {
        label: 'Ver detalhes',
        onClick: () => openTankDialog('view', tank),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openTankDialog('edit', tank),
        icon: <Pencil className="h-4 w-4" />,
      },
      {
        label: 'Excluir',
        onClick: () => handleTankDelete(tank.id, tank.name),
        variant: 'danger' as const,
        icon: <Trash className="h-4 w-4" />,
      },
    ],
    [handleTankDelete, openTankDialog],
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Carregando...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return <div className="p-8 text-center text-red-600">Erro ao carregar tanques.</div>;
    }

    if (!filteredTanks.length) {
      return <div className="p-8 text-center text-slate-500">Nenhum tanque encontrado.</div>;
    }

    return (
      <>
        <TankTable
          tanks={filteredTanks}
          openTankDialog={openTankDialog}
          handleTankDelete={handleTankDelete}
          isDeleting={isDeleting}
          rowActions={getRowActions}
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
      <TankDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setDialogOpen(false);
        }}
        mode={dialogMode}
        tank={selectedTank}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativas</CardTitle>
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {data?.tanks.filter((t) => t.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inativas / Suspensas
            </CardTitle>
            <div className="h-2 w-2 rounded-full bg-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {data?.tanks.filter((t) => t.status !== 'active').length}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <SearchField
            search={search}
            setSearch={setSearch}
            setCurrentPage={setPage}
            placeholder="Buscar por nome, CNPJ ou e-mail..."
          />

          <StatusFilterTabs
            filter={filter}
            onChange={setFilter}
            inactiveCount={stats.inactive}
            labels={{
              all: 'Todas',
              active: 'Ativas',
              inactive: 'Inativas',
              maintenance: 'Manutenção',
            }}
          />
        </CardContent>
      </Card>

      <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}
