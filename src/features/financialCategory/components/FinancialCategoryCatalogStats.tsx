'use client';

import type { FinancialCategoryCatalogStats } from '../types';
import { Tag, TrendingDown, TrendingUp } from 'lucide-react';

type Props = {
  stats: FinancialCategoryCatalogStats;
};

export function FinancialCategoryCatalogStatsCards({ stats }: Readonly<Props>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Total de Categorias</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <Tag className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Categorias de Receita</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">{stats.revenueCount}</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Categorias de Despesa</p>
            <p className="mt-1 text-3xl font-bold text-rose-600">{stats.expenseCount}</p>
          </div>
          <div className="rounded-lg bg-rose-50 p-2">
            <TrendingDown className="h-5 w-5 text-rose-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
