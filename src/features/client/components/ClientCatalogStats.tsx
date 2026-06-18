'use client';

import type { ClientCatalogStats } from '../types';
import { Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';

type ClientCatalogStatsProps = {
  stats: ClientCatalogStats;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function ClientCatalogStatsCards({ stats }: Readonly<ClientCatalogStatsProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Total</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.total}</p>
            <p className="mt-0.5 text-xs text-slate-400">clientes cadastrados</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <Users className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Ativos</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">{stats.activeCount}</p>
            <p className="mt-0.5 text-xs text-slate-400">clientes ativos</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-2">
            <UserCheck className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Prospects</p>
            <p className="mt-1 text-3xl font-bold text-blue-600">{stats.prospectCount}</p>
            <p className="mt-0.5 text-xs text-slate-400">em prospecção</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-2">
            <UserPlus className="h-5 w-5 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Receita Acumulada</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stats.totalCreditLimit > 0 ? formatCurrency(stats.totalCreditLimit) : '—'}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">limite de crédito total</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <TrendingUp className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
