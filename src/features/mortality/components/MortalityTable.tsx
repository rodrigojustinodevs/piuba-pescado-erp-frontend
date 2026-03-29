'use client';

import type { Mortality } from '../types';
import {
  DataTable,
  createCrudListRowActions,
  type DataTableColumn,
} from '@/shared/components/Table';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';

function formatNumber(value: number): string {
  return Number.isFinite(value) ? String(value) : '—';
}

interface MortalityTableProps {
  mortalities: Mortality[];
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
}

function getRowLabel(row: Mortality): string {
  return `${row.batchName || 'Lote'} - ${formatNullableDatePtBR(row.mortalityDate)}`;
}

export function MortalityTable({
  mortalities,
  onDelete,
  isDeleting = false,
}: Readonly<MortalityTableProps>) {
  const columns: Array<DataTableColumn<Mortality>> = [
    {
      id: 'batchName',
      header: 'Lote',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A]">{row.batchName || '—'}</div>
      ),
    },
    {
      id: 'mortalityDate',
      header: 'Data',
      cell: (row) => (
        <div className="text-sm text-slate-600">{formatNullableDatePtBR(row.mortalityDate)}</div>
      ),
    },
    {
      id: 'quantity',
      header: 'Quantidade',
      cell: (row) => <div className="text-sm text-slate-600">{formatNumber(row.quantity)}</div>,
    },
    {
      id: 'cause',
      header: 'Causa',
      cell: (row) => (
        <div className="text-sm text-slate-600 max-w-[240px] truncate" title={row.cause}>
          {row.cause || '—'}
        </div>
      ),
    },
    {
      id: 'updatedAt',
      header: 'Atualizado em',
      cell: (row) => (
        <div className="text-sm text-slate-500">{formatNullableDatePtBR(row.updatedAt, true)}</div>
      ),
    },
  ];

  return (
    <DataTable
      data={mortalities}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={createCrudListRowActions({
        basePath: '/company/mortalities',
        onDelete,
        getRowLabel,
        isDeleting,
      })}
      emptyState={
        <div className="p-8 text-center text-slate-500">
          Nenhum registro de mortalidade encontrado.
        </div>
      }
    />
  );
}
