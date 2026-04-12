'use client';

import type { FinancialTransaction } from '../types';
import { DataTable, type DataTableColumn } from '@/shared/components/Table';
import { getStatusBadgeClassNames } from '@/shared/utils/statusBadgeClassNames';

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value.includes('T') ? value : `${value}T12:00:00`);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return value;
  }
}

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(d.getTime())) return value;
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

function getTypeBadgeClassName(type: string): string {
  const key = type?.toLowerCase?.() ?? '';
  if (key === 'revenue') return 'bg-emerald-100 text-emerald-700';
  if (key === 'expense') return 'bg-rose-100 text-rose-700';
  if (key === 'investment') return 'bg-violet-100 text-violet-700';
  return 'bg-slate-100 text-slate-700';
}

function getStatusClassName(status: string): string {
  const key = status?.toLowerCase?.() ?? '';
  if (key === 'paid') return 'bg-emerald-100 text-emerald-700';
  return getStatusBadgeClassNames(status);
}

export function FinancialTransactionTable({
  financialTransactions,
}: {
  financialTransactions: FinancialTransaction[];
}) {
  const columns: Array<DataTableColumn<FinancialTransaction>> = [
    {
      id: 'dueDate',
      header: 'Vencimento',
      cell: (row) => <div className="text-sm font-medium text-[#0F172A]">{formatDate(row.dueDate)}</div>,
    },
    {
      id: 'type',
      header: 'Tipo',
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getTypeBadgeClassName(row.type)}`}
        >
          {row.typeLabel}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusClassName(row.status)}`}
        >
          {row.statusLabel}
        </span>
      ),
    },
    {
      id: 'amount',
      header: 'Valor',
      cell: (row) => <div className="text-sm text-slate-600 tabular-nums">{formatMoney(row.amount)}</div>,
    },
    {
      id: 'description',
      header: 'Descrição',
      cell: (row) => <div className="text-sm text-slate-600">{row.description || '—'}</div>,
    },
    {
      id: 'categoryName',
      header: 'Categoria',
      cell: (row) => <div className="text-sm text-slate-600">{row.categoryName || '—'}</div>,
    },
    {
      id: 'updatedAt',
      header: 'Atualizado em',
      cell: (row) => <div className="text-sm text-slate-500">{formatDateTime(row.updatedAt)}</div>,
    },
  ];

  return (
    <DataTable
      data={financialTransactions}
      columns={columns}
      getRowId={(row) => row.id}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhuma transação financeira encontrada.</div>}
    />
  );
}

