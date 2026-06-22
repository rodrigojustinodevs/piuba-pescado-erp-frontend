'use client';

import type { Batch, BatchCultivation } from '../types';
import { DataTable, DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { BatchStatusBadge } from './BatchStatusBadge';
import { formatDate } from '../utils/format';
import { Badge } from '@/src/shared/components/ui/Badge';
import { formatNumber } from '@/shared/utils/numberFormat';
function CultivationBadge({ label }: { label: string }) {
  return <Badge variant="outline">{label}</Badge>;
}

export interface BatchTableProps {
  batches: Batch[];
  cultivationLabels: Record<BatchCultivation, string>;
  getRowActions: (batch: Batch) => DataTableAction[];
}

export function BatchTable({
  batches,
  cultivationLabels,
  getRowActions,
}: Readonly<BatchTableProps>) {
  const columns: Array<DataTableColumn<Batch>> = [
    {
      id: 'name',
      header: 'Nome',
      cell: (batch) => (
        <div className="flex flex-col gap-1">
          <div className="font-medium">{batch.name}</div>
          <div className="text-xs text-muted-foreground line-clamp-1">{batch.description}</div>
        </div>
      ),
    },
    {
      id: 'species',
      header: 'Espécie',
      cellClassName: 'text-sm',
      cell: (batch) => {
        return batch.species;
      },
    },
    {
      id: 'cultivation',
      header: 'Cultivo',
      cell: (batch) => <CultivationBadge label={cultivationLabels[batch.cultivation]} />,
    },
    {
      id: 'initialQuantity',
      header: 'Qtd. Inicial',
      cell: (batch) => {
        return formatNumber(batch.initialQuantity);
      },
    },
    {
      id: 'entryDate',
      header: 'Data de Entrada',
      cell: (batch) => {
        return formatDate(batch.entryDate);
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: (batch) => <BatchStatusBadge status={batch.status} />,
    },
    {
      id: 'createdAt',
      header: 'Criado em',
      cellClassName: 'text-sm text-muted-foreground',
      cell: (batch) => {
        return formatDate(batch.createdAt);
      },
    },
  ];

  if (batches.length === 0) {
    return <div className="p-8 text-center text-slate-500">Nenhum lote encontrado.</div>;
  }

  return (
    <DataTable
      data={batches}
      columns={columns}
      getRowId={(batch) => batch.id}
      rowActions={getRowActions}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum produto encontrado.</div>}
      showPagination={false}
    />
  );
}
