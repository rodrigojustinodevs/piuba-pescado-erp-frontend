'use client';

import type { StockTransactionCatalogStats } from '../types';
import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight, DollarSign } from 'lucide-react';

type StockTransactionCatalogStatsProps = {
  stats: StockTransactionCatalogStats;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function StockTransactionCatalogStatsCards({
  stats,
}: Readonly<StockTransactionCatalogStatsProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Total de Movimentações</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.total}</p>
            <p className="mt-0.5 text-xs text-slate-400">na página atual</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <ArrowLeftRight className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Entradas</p>
            <p
              className={`mt-1 text-3xl font-bold ${stats.entriesCount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}
            >
              {stats.entriesCount}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">movimentações de entrada</p>
          </div>
          <div
            className={`rounded-lg p-2 ${stats.entriesCount > 0 ? 'bg-emerald-50' : 'bg-slate-100'}`}
          >
            <ArrowDownLeft
              className={`h-5 w-5 ${stats.entriesCount > 0 ? 'text-emerald-600' : 'text-slate-500'}`}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Saídas</p>
            <p
              className={`mt-1 text-3xl font-bold ${stats.exitsCount > 0 ? 'text-red-600' : 'text-slate-900'}`}
            >
              {stats.exitsCount}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">movimentações de saída</p>
          </div>
          <div
            className={`rounded-lg p-2 ${stats.exitsCount > 0 ? 'bg-red-50' : 'bg-slate-100'}`}
          >
            <ArrowUpRight
              className={`h-5 w-5 ${stats.exitsCount > 0 ? 'text-red-600' : 'text-slate-500'}`}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Valor Total Movimentado</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stats.totalValue > 0 ? formatCurrency(stats.totalValue) : '—'}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">custo das movimentações</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <DollarSign className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
