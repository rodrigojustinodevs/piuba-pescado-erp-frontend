'use client';

import { ShoppingCart, Clock, DollarSign, CheckCircle } from 'lucide-react';
import type { PurchaseCatalogStats } from '../types';
import { formatCurrency } from '@/shared/utils/numberFormat';

type PurchaseCatalogStatsProps = {
  stats: PurchaseCatalogStats;
};


export function PurchaseCatalogStatsCards({ stats }: Readonly<PurchaseCatalogStatsProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Total de Compras</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.totalPurchases}</p>
            <p className="mt-0.5 text-xs text-slate-400">registradas</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <ShoppingCart className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Pendentes</p>
            <p className={`mt-1 text-3xl font-bold ${stats.pendingCount > 0 ? 'text-amber-500' : 'text-slate-900'}`}>
              {stats.pendingCount}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">aguardando recebimento</p>
          </div>
          <div className={`rounded-lg p-2 ${stats.pendingCount > 0 ? 'bg-amber-50' : 'bg-slate-100'}`}>
            <Clock className={`h-5 w-5 ${stats.pendingCount > 0 ? 'text-amber-500' : 'text-slate-500'}`} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Valor Total</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stats.totalValue > 0 ? formatCurrency(stats.totalValue) : '—'}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">em compras registradas</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <DollarSign className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Recebidas</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.receivedCount}</p>
            <p className="mt-0.5 text-xs text-slate-400">concluídas</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
