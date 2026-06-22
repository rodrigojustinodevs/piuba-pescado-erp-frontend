'use client';

import type { StockLocation } from '../types';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { Progress } from '@/src/shared/components/ui/Progress';
import { Warehouse, MapPin } from 'lucide-react';

type StockTableProps = {
  stocks: StockLocation[];
  getRowActions?: (row: StockLocation) => DataTableAction[];
};

function OccupancyCell({
  currentQuantity,
  capacity,
}: Readonly<{
  currentQuantity: number;
  capacity: number | null;
}>) {
  const hasCapacity = capacity != null && capacity > 0;
  const pct = hasCapacity ? Math.min(100, (currentQuantity / capacity) * 100) : 0;

  return (
    <div className="space-y-1 min-w-[140px]">
      <div className="text-xs text-muted-foreground">
        {currentQuantity} / {capacity}
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}

const columns: Array<DataTableColumn<StockLocation>> = [
    {
      id: 'code',
      header: 'Código',
      cell: (row) => (
        <span className="font-mono text-sm text-slate-600 whitespace-nowrap">{row.code}</span>
      ),
    },
    {
      id: 'name',
      header: 'Nome',
      cell: (row) => (
        <div className="flex items-center gap-2.5 min-w-40">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal-50">
            <Warehouse className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{row.name}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-400 truncate max-w-45">{row.location}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Tipo',
      cell: (row) => <span className="text-sm text-slate-600">{row.typeLabel}</span>,
    },
    {
      id: 'responsible',
      header: 'Responsável',
      cell: (row) => (
        <span className="text-sm text-slate-600">
          {row.responsible ?? <span className="text-slate-400">—</span>}
        </span>
      ),
    },
    {
      id: 'occupancy',
      header: 'Ocupação',
      cell: (row) => (
        <OccupancyCell currentQuantity={row.currentQuantity} capacity={row.capacity} />
      ),
    },
    {
      id: 'totalValue',
      header: 'Valor',
      cell: (row) => (
        <span className="text-sm text-slate-700 tabular-nums whitespace-nowrap">
          {row.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => {
        const isActive = row.status === 'active';
        return (
          <span
            className={
              isActive
                ? 'inline-flex items-center rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-medium text-white'
                : 'inline-flex items-center rounded-full border border-slate-300 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-500'
            }
          >
            {isActive ? 'Ativo' : 'Inativo'}
          </span>
        );
      },
    },
];

export function StockTable({ stocks, getRowActions }: Readonly<StockTableProps>) {
  return (
    <DataTable
      data={stocks}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={getRowActions}
      emptyState={
        <div className="p-8 text-center text-slate-500">
          Nenhum local de armazenamento encontrado.
        </div>
      }
      showPagination={false}
    />
  );
}
