'use client';

import type { Supply } from '../types';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { Package } from 'lucide-react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function StatusBadge({ status, statusLabel }: { status: string; statusLabel: string }) {
  const isBelowMin = status === 'below_minimum' || status === 'low_stock';
  return isBelowMin ? (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
      {statusLabel}
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
      {statusLabel}
    </span>
  );
}

type SupplyTableProps = {
  supplies: Supply[];
  getRowActions?: (row: Supply) => DataTableAction[];
};

export function SupplyTable({ supplies, getRowActions }: Readonly<SupplyTableProps>) {
  const columns: Array<DataTableColumn<Supply>> = [
    {
      id: 'sku',
      header: 'SKU',
      cell: (row) => <div className="text-xs font-mono text-slate-500">{row.sku || '—'}</div>,
    },
    {
      id: 'name',
      header: 'Nome',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100">
            <Package className="h-4 w-4 text-slate-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">{row.name}</div>
            {row.supplierName && <div className="text-xs text-slate-400">{row.supplierName}</div>}
          </div>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Categoria',
      cell: (row) => (
        <div className="text-sm text-slate-600">{row.categoryLabel || row.category || '—'}</div>
      ),
    },
    {
      id: 'stock',
      header: 'Estoque',
      cell: (row) => (
        <div>
          <div className="text-sm font-medium text-slate-800">
            {row.currentStock.toLocaleString('pt-BR')} {row.defaultUnit}
          </div>
          <div className="text-xs text-slate-400">mín. {row.minStock.toLocaleString('pt-BR')}</div>
        </div>
      ),
    },
    {
      id: 'unitCost',
      header: 'Custo',
      cell: (row) => (
        <div className="text-sm text-slate-700">
          {row.unitCost > 0 ? formatCurrency(row.unitCost) : '—'}
        </div>
      ),
    },
    {
      id: 'salePrice',
      header: 'Preço Venda',
      cell: (row) => (
        <div className="text-sm text-slate-700">
          {row.salePrice > 0 ? formatCurrency(row.salePrice) : '—'}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} statusLabel={row.statusLabel} />,
    },
  ];

  return (
    <DataTable
      data={supplies}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={getRowActions}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum produto encontrado.</div>}
      showPagination={false}
    />
  );
}
