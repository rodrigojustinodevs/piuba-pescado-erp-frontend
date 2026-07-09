'use client';

import type { FinancialCategory } from '../types';
import { displayFinancialCategoryType } from '../utils/labels';
import { getFinancialCategoryTypeBadgeClassNames } from '../utils/typeBadgeClassNames';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { formatCurrency } from '@/shared/utils/numberFormat';


function getTypeIcon(isRevenue: boolean, isExpense: boolean) {
  if (isRevenue) return <TrendingUp className="h-3 w-3" />;
  if (isExpense) return <TrendingDown className="h-3 w-3" />;
  return <BarChart2 className="h-3 w-3" />;
}

function TypeBadge({ type, typeLabel }: Readonly<{ type: string; typeLabel: string }>) {
  const isRevenue = type === 'revenue' || type === 'income';
  const isExpense = type === 'expense';
  const label = displayFinancialCategoryType({ type, typeLabel });

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getFinancialCategoryTypeBadgeClassNames(type)}`}
    >
      {getTypeIcon(isRevenue, isExpense)}
      {label}
    </span>
  );
}

function getAmountColorClass(isRevenue: boolean, isExpense: boolean, amount: number): string {
  if (isRevenue) return 'text-emerald-600';
  if (isExpense && amount > 0) return 'text-rose-600';
  return 'text-slate-700';
}

function AmountCell({ amount, type }: Readonly<{ amount: number; type: string }>) {
  const isRevenue = type === 'revenue' || type === 'income';
  const isExpense = type === 'expense';
  const colorClass = getAmountColorClass(isRevenue, isExpense, amount);

  return (
    <div className={`text-sm font-medium ${colorClass}`}>
      {amount > 0 ? formatCurrency(amount) : <span className="text-slate-400">—</span>}
    </div>
  );
}

const columns: Array<DataTableColumn<FinancialCategory>> = [
    {
      id: 'name',
      header: 'Nome',
      cell: (row) => <div className="text-sm font-semibold text-slate-900">{row.name}</div>,
    },
    {
      id: 'type',
      header: 'Tipo',
      cell: (row) => <TypeBadge type={row.type} typeLabel={row.typeLabel} />,
    },
    {
      id: 'notes',
      header: 'Descrição',
      cell: (row) => (
        <div className="text-sm text-slate-500 max-w-55 truncate">{row.notes || '—'}</div>
      ),
    },
    {
      id: 'totalAmount',
      header: 'Total Movimentado',
      cell: (row) => <AmountCell amount={row.totalAmount} type={row.type} />,
    },
];

export type FinancialCategoryTableProps = {
  financialCategories: FinancialCategory[];
  getRowActions?: (row: FinancialCategory) => DataTableAction[];
};

export function FinancialCategoryTable({
  financialCategories,
  getRowActions,
}: Readonly<FinancialCategoryTableProps>) {
  return (
    <DataTable
      data={financialCategories}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={getRowActions}
      emptyState={
        <div className="p-8 text-center text-slate-500">
          Nenhuma categoria financeira encontrada.
        </div>
      }
      showPagination={false}
    />
  );
}
