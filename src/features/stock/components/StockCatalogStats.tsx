'use client';

import type { StockCatalogStats } from '../types';
import { Warehouse, CheckCircle2, XCircle, SlidersHorizontal, Boxes } from 'lucide-react';

type StockCatalogStatsProps = {
  stats: StockCatalogStats;
};

export function StockCatalogStatsCards({ stats }: Readonly<StockCatalogStatsProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Total de Estoques</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.totalStocks}</p>
            <p className="mt-0.5 text-xs text-slate-400">locais cadastrados</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-2">
            <Warehouse className="h-5 w-5 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Estoques Ativos</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">{stats.activeCount}</p>
            <p className="mt-0.5 text-xs text-slate-400">em operação</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Estoques Inativos</p>
            <p className={`mt-1 text-3xl font-bold ${stats.inactiveCount > 0 ? 'text-slate-700' : 'text-slate-900'}`}>
              {stats.inactiveCount}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">desativados</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <XCircle className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Capacidade Total</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {stats.totalCapacity > 0 ? stats.totalCapacity.toLocaleString('pt-BR') : '—'}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">capacidade somada</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <SlidersHorizontal className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Itens Armazenados</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.totalItems.toLocaleString('pt-BR')}</p>
            <p className="mt-0.5 text-xs text-slate-400">itens distintos</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <Boxes className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
