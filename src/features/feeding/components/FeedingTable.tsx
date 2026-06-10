'use client';

import { Badge } from '@/src/shared/components/ui/Badge';
import type { Feeding } from '../types';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { formatDateTimeLocal } from '@/shared/utils/dateFormat';

function formatNumber(value: number): string {
  return Number.isFinite(value) ? String(value) : '—';
}

/** Rótulo para confirmação de exclusão (mesma lógica da listagem). */
export function getFeedingRowLabel(row: Feeding): string {
  const batch = row.batch.name || '—';
  const when = formatDateTimeLocal(row.feedingDate);
  return `${batch} - ${when}`;
}

export interface FeedingTableProps {
  feedings: Feeding[];
  getRowActions: (row: Feeding) => DataTableAction[];
}

export function FeedingTable({ feedings, getRowActions }: Readonly<FeedingTableProps>) {
  const columns: Array<DataTableColumn<Feeding>> = [
    {
      id: 'feedingDate',
      header: 'Data da alimentação',
      cell: (row) => (
        <div className="text-sm text-slate-600">{formatDateTimeLocal(row.feedingDate)}</div>
      ),
    },
    {
      id: 'batchName',
      header: 'Lote',
      cellClassName: 'font-medium',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A]">{row.batch.name || '—'}</div>
      ),
    },
    {
      id: 'feedType',
      header: 'Tipo de ração',
      cell: (row) => (
        <Badge variant="secondary" className="capitalize">
          {row.feedType || '—'}
        </Badge>
      ),
    },
    {
      id: 'quantityProvided',
      header: 'Qtd. fornecida',
      headerClassName: 'text-right',
      cellClassName: 'text-right font-medium',
      cell: (row) => {
        return row.quantityProvided > 0 ? `${formatNumber(row.quantityProvided)} kg` : '—';
      },
    },
    {
      id: 'stockName',
      header: 'Estoque',
      cellClassName: 'max-w-[200px] truncate text-sm text-muted-foreground',
      cell: (row) => <div className="text-sm text-slate-600">{row.stock?.name || '—'}</div>,
    },
    {
      id: 'stockReductionQuantity',
      header: 'Baixa Estoque',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      cell: (row) => {
        return row.stockReductionQuantity > 0
          ? `${formatNumber(row.stockReductionQuantity)} kg`
          : '—';
      },
    },
  ];

  return (
    <DataTable
      data={feedings}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={getRowActions}
      emptyState={
        <div className="p-8 text-center text-slate-500">Nenhuma alimentação encontrada.</div>
      }
      showPagination={false}
    />
  );
}
