'use client';

import type { FinancialTransactionCatalogStats } from '../types';
import { TrendingUp, TrendingDown, AlertTriangle, BarChart2 } from 'lucide-react';

type Props = { stats: FinancialTransactionCatalogStats };

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function FinancialTransactionCatalogStatsCards({ stats }: Readonly<Props>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Total de Transações</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.total}</p>
            <p className="mt-0.5 text-xs text-slate-400">no período</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <BarChart2 className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">A Receber</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {stats.totalReceivable > 0 ? formatCurrency(stats.totalReceivable) : '—'}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">receitas pendentes</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">A Pagar</p>
            <p className="mt-1 text-2xl font-bold text-rose-600">
              {stats.totalPayable > 0 ? formatCurrency(stats.totalPayable) : '—'}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">despesas pendentes</p>
          </div>
          <div className="rounded-lg bg-rose-50 p-2">
            <TrendingDown className="h-5 w-5 text-rose-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Atrasadas</p>
            <p
              className={`mt-1 text-3xl font-bold ${stats.overdueCount > 0 ? 'text-amber-500' : 'text-slate-900'}`}
            >
              {stats.overdueCount}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">necessitam atenção</p>
          </div>
          <div className={`rounded-lg p-2 ${stats.overdueCount > 0 ? 'bg-amber-50' : 'bg-slate-100'}`}>
            <AlertTriangle
              className={`h-5 w-5 ${stats.overdueCount > 0 ? 'text-amber-500' : 'text-slate-500'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
