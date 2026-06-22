'use client';

import type {
  FinancialTransaction,
  FinancialTransactionStatus,
  FinancialTransactionType,
} from '../types';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { formatCalendarDatePtBR } from '@/shared/utils/dateFormat';
import { TrendingUp, TrendingDown, ArrowLeftRight, Landmark } from 'lucide-react';

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function TypeBadge({ type, typeLabel }: Readonly<{ type: FinancialTransactionType; typeLabel: string }>) {
  const styles: Record<FinancialTransactionType, { cls: string; icon: React.ReactNode }> = {
    income: { cls: 'bg-emerald-100 text-emerald-700', icon: <TrendingUp className="h-3 w-3" /> },
    expense: { cls: 'bg-rose-100 text-rose-700', icon: <TrendingDown className="h-3 w-3" /> },
    transfer: {
      cls: 'bg-violet-100 text-violet-700',
      icon: <ArrowLeftRight className="h-3 w-3" />,
    },
    investment: { cls: 'bg-blue-100 text-blue-700', icon: <Landmark className="h-3 w-3" /> },
    other: { cls: 'bg-slate-100 text-slate-600', icon: null },
  };
  const { cls, icon } = styles[type] ?? styles.other;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {icon}
      {typeLabel}
    </span>
  );
}

function StatusBadge({
  status,
  statusLabel,
}: Readonly<{
  status: FinancialTransactionStatus;
  statusLabel: string;
}>) {
  const styles: Record<FinancialTransactionStatus, string> = {
    paid: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-100 text-slate-500',
    other: 'bg-slate-100 text-slate-600',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.other}`}
    >
      {statusLabel}
    </span>
  );
}

function getAmountColor(type: FinancialTransactionType): string {
  if (type === 'income') return 'text-emerald-600';
  if (type === 'expense') return 'text-rose-600';
  return 'text-slate-700';
}

function AmountCell({ amount, type }: Readonly<{ amount: number; type: FinancialTransactionType }>) {
  return <div className={`text-sm font-semibold tabular-nums ${getAmountColor(type)}`}>{formatMoney(amount)}</div>;
}

const columns: Array<DataTableColumn<FinancialTransaction>> = [
  {
    id: 'description',
    header: 'Descrição',
    cell: (row) => (
      <div>
        <div className="text-sm font-medium text-slate-900">{row.description || '—'}</div>
        {row.categoryName && <div className="text-xs text-slate-400">{row.categoryName}</div>}
      </div>
    ),
  },
  {
    id: 'type',
    header: 'Tipo',
    cell: (row) => <TypeBadge type={row.type} typeLabel={row.typeLabel} />,
  },
  {
    id: 'dueDate',
    header: 'Vencimento',
    cell: (row) => (
      <div className="text-sm font-medium text-slate-800">
        {formatCalendarDatePtBR(row.dueDate)}
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => <StatusBadge status={row.status} statusLabel={row.statusLabel} />,
  },
  {
    id: 'amount',
    header: 'Valor',
    cell: (row) => <AmountCell amount={row.amount} type={row.type} />,
  },
  {
    id: 'methodLabel',
    header: 'Pagamento',
    cell: (row) => <div className="text-sm text-slate-500">{row.methodLabel || '—'}</div>,
  },
];

export type FinancialTransactionTableProps = {
  financialTransactions: FinancialTransaction[];
  getRowActions?: (row: FinancialTransaction) => DataTableAction[];
};

export function FinancialTransactionTable({
  financialTransactions,
  getRowActions,
}: Readonly<FinancialTransactionTableProps>) {
  return (
    <DataTable
      data={financialTransactions}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={getRowActions}
      emptyState={
        <div className="p-8 text-center text-slate-500">
          Nenhuma transação financeira encontrada.
        </div>
      }
      showPagination={false}
    />
  );
}
