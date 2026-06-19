'use client';

import { useState, useCallback } from 'react';
import type { Client, ClientListResponse, ClientDialogMode, ClientCatalogStats } from '../types';
import { ClientTable } from './ClientTable';
import { ClientDialog } from './ClientDialog';
import { ClientCatalogStatsCards } from './ClientCatalogStats';
import { Button } from '@/shared/components/ui/Button';
import { SearchField } from '@/shared/components/list';
import { Pagination } from '@/shared/components/list/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';
import {
  ListEmptyState,
  ListErrorState,
  ListLoadingState,
} from '@/shared/components/states/ListStates';
import { Eye, Pencil, Plus, Trash } from 'lucide-react';

export type ClientsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  statusFilter: string;
  setStatusFilter: (next: string) => void;
  segmentFilter: string;
  setSegmentFilter: (next: string) => void;
  data: ClientListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  clients: Client[];
  stats: ClientCatalogStats;
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

export function ClientsListView({
  page,
  setPage,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  segmentFilter,
  setSegmentFilter,
  data,
  isLoading,
  error,
  clients,
  stats,
  handleDelete,
}: Readonly<ClientsListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<ClientDialogMode>('create');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [perPage] = useState(10);

  const openDialog = useCallback((mode: ClientDialogMode, client: Client | null = null) => {
    setDialogMode(mode);
    setSelectedClient(client);
    setDialogOpen(true);
  }, []);

  const getRowActions = useCallback(
    (row: Client) => [
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
        onClick: () => handleDelete(row.id, row.name),
        icon: <Trash className="h-4 w-4" />,
      },
    ],
    [handleDelete, openDialog],
  );

  const total = data?.total ?? 0;
  const pagedClients = clients.slice((page - 1) * perPage, page * perPage);

  const renderContent = () => {
    if (isLoading) return <ListLoadingState />;
    if (error) return <ListErrorState title="Erro ao carregar clientes" message="Não foi possível carregar os clientes. Tente novamente." />;
    if (clients.length === 0) return <ListEmptyState title="Nenhum cliente encontrado." />;
    return <ClientTable clients={pagedClients} getRowActions={getRowActions} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Cadastro comercial, segmentação e histórico de vendas.
          </p>
        </div>
        <Button className="gap-2 shrink-0" onClick={() => openDialog('create')}>
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats */}
      <ClientCatalogStatsCards stats={stats} />

      {/* Table card */}
      <Card>
        <CardHeader className="flex-row justify-between px-5 py-4">
          <CardTitle className="text-base">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchField
                search={search}
                setSearch={setSearch}
                setCurrentPage={setPage}
                placeholder="Buscar por nome, documento, contato..."
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5A4]"
            >
              <option value="">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inativo</option>
            </select>

            <select
              value={segmentFilter}
              onChange={(e) => {
                setSegmentFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5A4]"
            >
              <option value="">Todos os segmentos</option>
              <option value="retail">Varejo</option>
              <option value="wholesale">Atacado</option>
            </select>
          </div>

          <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {renderContent()}
          </main>

          {!isLoading && !error && clients.length > 0 && (
            <Pagination
              page={page}
              limit={perPage}
              total={total}
              itemLabelPlural="clientes"
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      <ClientDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedClient(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        client={selectedClient}
        onSuccess={() => setDialogOpen(false)}
      />
    </div>
  );
}
