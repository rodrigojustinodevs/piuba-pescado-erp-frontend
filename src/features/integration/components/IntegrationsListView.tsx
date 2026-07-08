'use client';

import { useCallback, useState } from 'react';
import { AlertTriangle, Cpu, Eye, Pencil, Plus, RefreshCw, Trash, Wifi } from 'lucide-react';
import type {
  Integration,
  IntegrationDialogMode,
  IntegrationStatusFilter,
  IntegrationTypeFilter,
} from '../types';
import type { useIntegrationsListPage } from '../hooks/useIntegrationsListPage';
import { IntegrationTable } from './IntegrationTable';
import { IntegrationDialog } from './IntegrationDialog';
import { SearchField } from '@/shared/components/list';
import { StatCard } from '@/shared/components/Cards/StatCard';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { TYPE_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from '../utils/integrationLabels';

export type IntegrationsListViewProps = ReturnType<typeof useIntegrationsListPage>;

export function IntegrationsListView({
  search,
  setSearch,
  filter,
  setFilter,
  typeFilter,
  setTypeFilter,
  filteredIntegrations,
  stats,
  createIntegration,
  updateIntegration,
  handleDelete,
  handleSync,
  isSyncing,
}: Readonly<IntegrationsListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<IntegrationDialogMode>('create');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const openIntegrationDialog = useCallback(
    (mode: IntegrationDialogMode, integration: Integration | null = null) => {
      setDialogMode(mode);
      setSelectedIntegration(integration);
      setDialogOpen(true);
    },
    [],
  );

  const getRowActions = useCallback(
    (integration: Integration) => [
      {
        label: 'Ver detalhes',
        onClick: () => openIntegrationDialog('view', integration),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openIntegrationDialog('edit', integration),
        icon: <Pencil className="h-4 w-4" />,
      },
      {
        label: 'Remover',
        onClick: () => handleDelete(integration.id, integration.name),
        variant: 'danger' as const,
        icon: <Trash className="h-4 w-4" />,
      },
    ],
    [handleDelete, openIntegrationDialog],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0EA5A4]/10">
            <Wifi className="h-7 w-7 text-[#0EA5A4]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">Integrações IoT</h1>
            <p className="mt-1 text-base text-slate-500">
              Sensores, gateways e APIs conectados à plataforma
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSync} disabled={isSyncing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sincronizar
          </Button>
          <Button className="gap-2" onClick={() => openIntegrationDialog('create')}>
            <Plus className="h-4 w-4" />
            Nova Integração
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Integrações"
          value={stats.total}
          icon={<Wifi className="h-4 w-4 text-[#0EA5A4]" />}
        />
        <StatCard
          label="Conectadas"
          value={stats.connected}
          icon={<Wifi className="h-4 w-4 text-emerald-600" />}
        />
        <StatCard
          label="Com erros"
          value={stats.withErrors}
          icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
        />
        <StatCard
          label="Dispositivos"
          value={stats.devices}
          icon={<Cpu className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <SearchField
            search={search}
            setSearch={setSearch}
            setCurrentPage={() => {}}
            placeholder="Buscar por nome, fabricante, modelo..."
          />

          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as IntegrationTypeFilter)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as IntegrationStatusFilter)}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <IntegrationTable integrations={filteredIntegrations} rowActions={getRowActions} />
      </main>

      <IntegrationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => setDialogOpen(false)}
        mode={dialogMode}
        integration={selectedIntegration}
        onCreate={createIntegration}
        onUpdate={updateIntegration}
      />
    </div>
  );
}
