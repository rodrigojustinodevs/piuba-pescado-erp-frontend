'use client';

import type { SupplyCatalogStats } from '../types';
import { Package, Tag, AlertTriangle, DollarSign } from 'lucide-react';

type SupplyCatalogStatsProps = {
  stats: SupplyCatalogStats;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function SupplyCatalogStatsCards({ stats }: Readonly<SupplyCatalogStatsProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Itens Cadastrados</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats.totalItems}</p>
            <p className="mt-0.5 text-xs text-slate-400">no catálogo</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <Package className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Produtos Vendáveis</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">—</p>
            <p className="mt-0.5 text-xs text-slate-400">disponíveis para venda</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <Tag className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Estoque Baixo</p>
            <p className={`mt-1 text-3xl font-bold ${stats.belowMinimumCount > 0 ? 'text-amber-500' : 'text-slate-900'}`}>
              {stats.belowMinimumCount}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">necessitam reposição</p>
          </div>
          <div className={`rounded-lg p-2 ${stats.belowMinimumCount > 0 ? 'bg-amber-50' : 'bg-slate-100'}`}>
            <AlertTriangle className={`h-5 w-5 ${stats.belowMinimumCount > 0 ? 'text-amber-500' : 'text-slate-500'}`} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Valor em Estoque</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stats.totalStockValue > 0 ? formatCurrency(stats.totalStockValue) : '—'}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">a custo de aquisição</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <DollarSign className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
