'use client';

import type { Feeding } from '../types';
import { DataTable, EditIcon, EyeIcon, type DataTableColumn } from '@/shared/components/Table';

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

interface FeedingTableProps {
  feedings: Feeding[];
}

export function FeedingTable({ feedings }: Readonly<FeedingTableProps>) {
  const columns: Array<DataTableColumn<Feeding>> = [
    {
      id: 'batchName',
      header: 'Lote',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A]">{row.batchName || '—'}</div>
      ),
    },
    {
      id: 'feedingDate',
      header: 'Data da alimentação',
      cell: (row) => (
        <div className="text-sm text-slate-600">{formatDateTime(row.feedingDate)}</div>
      ),
    },
    {
      id: 'quantityProvided',
      header: 'Qtd. fornecida',
      cell: (row) => (
        <div className="text-sm text-slate-600">{formatNumber(row.quantityProvided)}</div>
      ),
    },
    {
      id: 'feedType',
      header: 'Tipo de ração',
      cell: (row) => <div className="text-sm text-slate-600">{row.feedType || '—'}</div>,
    },
    {
      id: 'stockReductionQuantity',
      header: 'Redução estoque',
      cell: (row) => (
        <div className="text-sm text-slate-600">{formatNumber(row.stockReductionQuantity)}</div>
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
      data={feedings}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={(row) => [
        {
          label: 'Ver detalhes',
          href: `/company/feedings/${row.id}`,
          icon: <EyeIcon className="h-4 w-4" />,
        },
        {
          label: 'Editar',
          href: `/company/feedings/${row.id}/edit`,
          icon: <EditIcon className="h-4 w-4" />,
        },
      ]}
      emptyState={
        <div className="p-8 text-center text-slate-500">Nenhuma alimentação encontrada.</div>
      }
    />
  );
}
