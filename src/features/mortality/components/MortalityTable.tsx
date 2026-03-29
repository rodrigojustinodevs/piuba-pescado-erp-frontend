'use client';

import type { Mortality } from '../types';
import {
  DataTable,
  EditIcon,
  EyeIcon,
  SpinnerIcon,
  TrashIcon,
  type DataTableColumn,
} from '@/shared/components/Table';

function formatDate(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return value;
  }
}

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

function formatNumber(value: number): string {
  return Number.isFinite(value) ? String(value) : '—';
}

interface MortalityTableProps {
  mortalities: Mortality[];
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
}

function getRowLabel(row: Mortality): string {
  return `${row.batchName || 'Lote'} - ${formatDate(row.mortalityDate)}`;
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
      cell: (row) => <div className="text-sm text-slate-600">{formatDate(row.mortalityDate)}</div>,
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
      cell: (row) => <div className="text-sm text-slate-500">{formatDateTime(row.updatedAt)}</div>,
    },
  ];

  return (
    <DataTable
      data={mortalities}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={(row) => {
        const actions = [
          {
            label: 'Ver detalhes',
            href: `/company/mortalities/${row.id}`,
            icon: <EyeIcon className="h-4 w-4" />,
          },
          {
            label: 'Editar',
            href: `/company/mortalities/${row.id}/edit`,
            icon: <EditIcon className="h-4 w-4" />,
          },
        ];
        if (!onDelete) return actions;
        return [
          ...actions,
          {
            label: 'Excluir',
            onClick: () => onDelete(row.id, getRowLabel(row)),
            variant: 'danger' as const,
            disabled: isDeleting,
            icon: isDeleting ? (
              <SpinnerIcon className="h-4 w-4 animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            ),
          },
        ];
      }}
      emptyState={
        <div className="p-8 text-center text-slate-500">
          Nenhum registro de mortalidade encontrado.
        </div>
      }
    />
  );
}
