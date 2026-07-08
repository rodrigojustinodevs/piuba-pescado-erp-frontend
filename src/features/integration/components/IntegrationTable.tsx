'use client';

import { AlertTriangle } from 'lucide-react';
import type { Integration, IntegrationTableProps } from '../types';
import { DataTable, type DataTableColumn } from '@/shared/components/Table';
import { Badge } from '@/shared/components/ui/Badge';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { STATUS_BADGE_STYLES, STATUS_LABELS, TYPE_ICONS, TYPE_LABELS } from '../utils/integrationLabels';

const STATUS_DOT_STYLES: Record<Integration['status'], string> = {
  connected: 'bg-emerald-500',
  error: 'bg-red-500',
  disconnected: 'bg-slate-400',
  pending: 'bg-amber-500',
};

function IntegrationNameCell({ integration }: Readonly<{ integration: Integration }>) {
  const TypeIcon = TYPE_ICONS[integration.type];
  const hasError = integration.status === 'error';

  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            hasError ? 'bg-red-50 text-red-500' : 'bg-[#0EA5A4]/10 text-[#0EA5A4]'
          }`}
        >
          {hasError ? <AlertTriangle className="h-4 w-4" /> : <TypeIcon className="h-4 w-4" />}
        </div>
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${STATUS_DOT_STYLES[integration.status]}`}
        />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-slate-900">{integration.name}</div>
        <div className="truncate text-xs text-slate-400">
          {integration.manufacturer} · {integration.model}
        </div>
      </div>
    </div>
  );
}

function buildColumns(): Array<DataTableColumn<Integration>> {
  return [
    {
      id: 'name',
      header: 'Integração',
      cell: (integration) => <IntegrationNameCell integration={integration} />,
    },
    {
      id: 'type',
      header: 'Tipo',
      cell: (integration) => <Badge variant="outline">{TYPE_LABELS[integration.type]}</Badge>,
    },
    {
      id: 'protocol',
      header: 'Protocolo',
      cellClassName: 'text-sm text-slate-600',
      cell: (integration) => integration.protocol,
    },
    {
      id: 'endpoint',
      header: 'Endpoint',
      cellClassName: 'max-w-[220px] truncate font-mono text-xs text-slate-500',
      cell: (integration) => integration.endpoint,
    },
    {
      id: 'deviceCount',
      header: 'Dispositivos',
      align: 'center',
      cellClassName: 'text-sm font-medium text-slate-700',
      cell: (integration) => integration.deviceCount,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (integration) => (
        <Badge className={STATUS_BADGE_STYLES[integration.status]}>
          {STATUS_LABELS[integration.status]}
        </Badge>
      ),
    },
    {
      id: 'lastSyncAt',
      header: 'Última sinc.',
      cellClassName: 'text-sm text-muted-foreground',
      cell: (integration) => formatNullableDatePtBR(integration.lastSyncAt, true),
    },
  ];
}

export function IntegrationTable({ integrations, rowActions }: Readonly<IntegrationTableProps>) {
  const columns = buildColumns();

  return (
    <DataTable
      data={integrations}
      columns={columns}
      getRowId={(integration) => integration.id}
      rowActions={rowActions}
      emptyState={
        <div className="p-8 text-center text-slate-500">Nenhuma integração encontrada.</div>
      }
    />
  );
}
