'use client';

import { TrendingUp, TrendingDown, BarChart2, Tag, Building2, Calendar } from 'lucide-react';
import type { FinancialCategory } from '../types';
import { displayFinancialCategoryStatus, displayFinancialCategoryType } from '../utils/labels';
import { getFinancialCategoryTypeBadgeClassNames } from '../utils/typeBadgeClassNames';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Separator } from '@/src/shared/components/ui/Separator';

type Props = {
  category: FinancialCategory | null;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function DetailItem({
  icon,
  label,
  value,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value: string;
}>) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-slate-400 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export function FinancialCategoryViewDialogContent({ category }: Readonly<Props>) {
  if (!category) return null;

  const typeLabel = displayFinancialCategoryType(category);
  const statusLabel = displayFinancialCategoryStatus(category);
  const isRevenue = category.type === 'revenue' || category.type === 'income';
  const isExpense = category.type === 'expense';

  let iconBgClass = 'bg-slate-100';
  let typeIcon = <BarChart2 className="h-5 w-5 text-slate-500" />;
  if (isRevenue) {
    iconBgClass = 'bg-emerald-50';
    typeIcon = <TrendingUp className="h-5 w-5 text-emerald-600" />;
  } else if (isExpense) {
    iconBgClass = 'bg-rose-50';
    typeIcon = <TrendingDown className="h-5 w-5 text-rose-600" />;
  }

  function getAmountColorClass() {
    if (isRevenue) return 'text-emerald-600';
    if (isExpense) return 'text-rose-600';
    return 'text-slate-900';
  }
  const amountColorClass = getAmountColorClass();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgClass}`}>
          {typeIcon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getFinancialCategoryTypeBadgeClassNames(category.type)}`}
            >
              {typeLabel}
            </span>
            <span className="text-xs text-slate-400">{statusLabel}</span>
          </div>
        </div>
      </div>

      {/* Total Movimentado */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-xs text-slate-500 mb-1">Total Movimentado</p>
        <p className={`text-2xl font-bold ${amountColorClass}`}>
          {formatCurrency(category.totalAmount)}
        </p>
      </div>

      {/* Descrição */}
      {category.notes && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs text-slate-500 mb-1">Descrição</p>
          <p className="text-sm text-slate-700">{category.notes}</p>
        </div>
      )}

      <Separator />

      {/* Detalhes */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Detalhes</p>
        <div className="grid grid-cols-2 gap-2">
          <DetailItem icon={<Tag className="h-4 w-4" />} label="Tipo" value={typeLabel} />
          <DetailItem
            icon={<Building2 className="h-4 w-4" />}
            label="Empresa"
            value={category.companyName || '—'}
          />
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>
          <Calendar className="inline h-3 w-3 mr-1" />
          Criado em: {formatNullableDatePtBR(category.createdAt, true)}
        </span>
        <span>Atualizado em: {formatNullableDatePtBR(category.updatedAt, true)}</span>
      </div>
    </div>
  );
}
