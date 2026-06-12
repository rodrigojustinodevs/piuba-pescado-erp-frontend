'use client';

import { STATUS_LABELS, type Transfer, type TransferStatus } from '../types';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { formatNumber } from '@/shared/utils/numberFormat';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/src/shared/components/ui/Badge';

const STATUS_STYLES: Record<TransferStatus, string> = {
  completed: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  scheduled: 'bg-sky-500/15 text-sky-700 border-sky-500/30',
  cancelled: 'bg-destructive/15 text-destructive border-destructive/40',
};

function getBatchLabel(row: Transfer): string {
  if (row.batchName) return row.batchName;
  if (row.batchId) return `${row.batchId.slice(0, 8)}…`;
  return '—';
}

function getTankLabel(id: string, name?: string): string {
  if (name) return name;
  if (id) return `${id.slice(0, 8)}…`;
  return '—';
}

interface TransferTableProps {
  transfers: Transfer[];
  getRowActions: (row: Transfer) => DataTableAction[];
}

const columns: Array<DataTableColumn<Transfer>> = [
  {
    id: 'transferDate',
    header: 'Data',
    cell: (row) => (
      <div className="text-sm text-slate-600">
        {formatNullableDatePtBR(row.transferDate ?? row.createdAt)}
      </div>
    ),
  },
  {
    id: 'batchName',
    header: 'Lote',
    cell: (row) => <div className="text-sm font-medium text-[#0F172A]">{getBatchLabel(row)}</div>,
  },
  {
    id: 'movement',
    header: 'Movimentação',
    cell: (row) => (
      <div className="flex items-center gap-2 text-sm">
        <span className="rounded bg-muted px-2 py-0.5">
          {getTankLabel(row.originTankId, row.originTankName)}
        </span>
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
        <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">
          {getTankLabel(row.destinationTankId, row.destinationTankName)}
        </span>
      </div>
    ),
  },
  {
    id: 'quantity',
    header: 'Quantidade',
    headerClassName: 'text-right',
    cellClassName: 'text-right',
    cell: (row) => <div className="text-sm text-slate-600">{String(row.quantity)}</div>,
  },
  {
    id: 'biomass',
    header: 'Biomassa (kg)',
    headerClassName: 'text-right',
    cellClassName: 'text-right',
    cell: (row) => (
      <div className="text-sm text-slate-600">
        {formatNumber((row.quantity * (row.averageWeight ?? 0)) / 1000, {
          maximumFractionDigits: 2,
        })}
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) =>
      row.status ? (
        <Badge variant="outline" className={STATUS_STYLES[row.status]}>
          {STATUS_LABELS[row.status]}
        </Badge>
      ) : (
        <span className="text-sm text-slate-400">—</span>
      ),
  },
  {
    id: 'description',
    header: 'Descrição',
    cell: (row) => <div className="text-sm text-slate-600">{row.description || '—'}</div>,
  },
];

export function TransferTable({ transfers, getRowActions }: Readonly<TransferTableProps>) {
  if (transfers.length === 0) {
    return <div className="p-8 text-center text-slate-500">Nenhuma transferência encontrada.</div>;
  }

  return (
    <DataTable
      data={transfers}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={getRowActions}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum produto encontrado.</div>}
      showPagination={false}
    />
  );
}
