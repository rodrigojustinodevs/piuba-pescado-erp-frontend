'use client';

import type {
  FinancialTransaction,
  FinancialTransactionStatus,
  FinancialTransactionType,
} from '../types';
import { DataTable, type DataTableColumn } from '@/shared/components/Table';
import { getStatusBadgeClassNames } from '@/shared/utils/statusBadgeClassNames';
import { formatCalendarDatePtBR, formatNullableDatePtBR } from '@/shared/utils/dateFormat';

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
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

function DueDateCell({ dueDate }: Readonly<{ dueDate: string | null }>) {
  return <div className="text-sm font-medium text-[#0F172A]">{formatCalendarDatePtBR(dueDate)}</div>;
}

function TypeCell({ type, typeLabel }: Readonly<{ type: FinancialTransactionType; typeLabel: string }>) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getTypeBadgeClassName(type)}`}
    >
      {typeLabel}
    </span>
  );
}

function StatusCell({
  status,
  statusLabel,
}: Readonly<{ status: FinancialTransactionStatus; statusLabel: string }>) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusClassName(status)}`}
    >
      {statusLabel}
    </span>
  );
}

function AmountCell({ amount }: Readonly<{ amount: number }>) {
  return <div className="text-sm text-slate-600 tabular-nums">{formatMoney(amount)}</div>;
}

function TextCell({ value }: Readonly<{ value: string | null | undefined }>) {
  return <div className="text-sm text-slate-600">{value || '—'}</div>;
}

function UpdatedAtCell({ updatedAt }: Readonly<{ updatedAt: string | null }>) {
  return <div className="text-sm text-slate-500">{formatNullableDatePtBR(updatedAt, true)}</div>;
}

const FINANCIAL_TRANSACTION_COLUMNS: Array<DataTableColumn<FinancialTransaction>> = [
  {
    id: 'dueDate',
    header: 'Vencimento',
    cell: (row) => <DueDateCell dueDate={row.dueDate} />,
  },
  {
    id: 'type',
    header: 'Tipo',
    cell: (row) => <TypeCell type={row.type} typeLabel={row.typeLabel} />,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => <StatusCell status={row.status} statusLabel={row.statusLabel} />,
  },
  {
    id: 'amount',
    header: 'Valor',
    cell: (row) => <AmountCell amount={row.amount} />,
  },
  {
    id: 'description',
    header: 'Descrição',
    cell: (row) => <TextCell value={row.description} />,
  },
  {
    id: 'categoryName',
    header: 'Categoria',
    cell: (row) => <TextCell value={row.categoryName} />,
  },
  {
    id: 'updatedAt',
    header: 'Atualizado em',
    cell: (row) => <UpdatedAtCell updatedAt={row.updatedAt} />,
  },
];

export type FinancialTransactionTableProps = {
  financialTransactions: FinancialTransaction[];
};

export function FinancialTransactionTable({
  financialTransactions,
}: Readonly<FinancialTransactionTableProps>) {
  return (
    <DataTable
      data={financialTransactions}
      columns={FINANCIAL_TRANSACTION_COLUMNS}
      getRowId={(row) => row.id}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhuma transação financeira encontrada.</div>}
    />
  );
}
