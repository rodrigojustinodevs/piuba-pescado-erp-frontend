'use client';

import type { Harvest, HarvestStatus, HarvestType } from '../types';
import { HARVEST_DESTINATION_LABELS, HARVEST_STATUS_LABELS, HARVEST_TYPE_LABELS } from '../types';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { Badge } from '@/src/shared/components/ui/Badge';
import { Calendar, Package } from 'lucide-react';

const STATUS_STYLES: Record<HarvestStatus, string> = {
  completed: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  scheduled: 'bg-sky-500/15 text-sky-700 border-sky-500/30',
  cancelled: 'bg-destructive/15 text-destructive border-destructive/40',
};

const TYPE_STYLES: Record<HarvestType, string> = {
  total: 'bg-primary/15 text-primary border-primary/30',
  partial: 'bg-muted text-foreground border-border',
  selective: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30',
  emergency: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30',
};

function calcSurvivalRate(d: Harvest): number {
  if (!d.initialPopulation) return 0;
  return Math.min(100, (d.harvestedQuantity / d.initialPopulation) * 100);
}

const fmt = (n: number, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat('pt-BR', opts).format(n);

const fmtCurrency = (n: number) => fmt(n, { style: 'currency', currency: 'BRL' });

function survivalBadge(row: Harvest) {
  const survival = calcSurvivalRate(row);
  return (
    <span
      className={
        survival >= 85
          ? 'text-emerald-600 dark:text-emerald-400'
          : survival >= 70
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-destructive'
      }
    >
      {fmt(survival, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
    </span>
  );
}

interface HarvestTableProps {
  harvests: Harvest[];
  getRowActions: (row: Harvest) => DataTableAction[];
}

const columns: Array<DataTableColumn<Harvest>> = [
  {
    id: 'harvestDate',
    header: 'Data',
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-sm">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        {formatNullableDatePtBR(row.harvestDate)}
      </div>
    ),
  },
  {
    id: 'batchName',
    header: 'Lote',
    cell: (row) => (
      <div className="space-y-0.5">
        <div className="font-medium">{row.batch?.name}</div>
        <div className="text-xs text-muted-foreground">{row.tankName}</div>
      </div>
    ),
  },
  {
    id: 'type',
    header: 'Tipo',
    cell: (row) =>
      row.type ? (
        <Badge variant="outline" className={TYPE_STYLES[row.type]}>
          {HARVEST_TYPE_LABELS[row.type]}
        </Badge>
      ) : (
        <span className="text-sm text-slate-400">—</span>
      ),
  },

  {
    id: 'destination',
    header: 'Destino',
    cell: (row) =>
      row.destination ? (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            {HARVEST_DESTINATION_LABELS[row.destination]}
          </div>
          <div className="text-sm">{row.clientDestination}</div>
        </div>
      ) : (
        <span className="text-sm text-slate-400">—</span>
      ),
  },
  {
    id: 'biomass',
    header: 'Biomassa (kg)',
    headerClassName: 'text-right',
    cellClassName: 'text-right font-medium',
    cell: (row) => (
      <div>
        {fmt((row.harvestedQuantity * row.averageWeight) / 1000, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    ),
  },
  {
    id: 'grossRevenue',
    header: 'Receita',
    headerClassName: 'text-right',
    cellClassName: 'text-right font-medium',
    cell: (row) => {
      const revenue = (row.sizeClassifications ?? []).reduce((acc, c) => {
        return acc + ((c.quantity * c.averageWeight) / 1000) * c.pricePerKg;
      }, 0);
      return fmtCurrency(revenue);
    },
  },
  {
    id: 'survival',
    header: 'Sobrev.',
    headerClassName: 'text-right',
    cellClassName: 'text-right',
    cell: (row) => survivalBadge(row),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) =>
      row.status ? (
        <Badge variant="outline" className={STATUS_STYLES[row.status]}>
          {HARVEST_STATUS_LABELS[row.status]}
        </Badge>
      ) : (
        <span className="text-sm text-slate-400">—</span>
      ),
  },
];

export function HarvestTable({ harvests, getRowActions }: Readonly<HarvestTableProps>) {
  if (harvests.length === 0) {
    return <div className="p-8 text-center text-slate-500">Nenhuma despesca encontrada.</div>;
  }

  return (
    <DataTable
      data={harvests}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={getRowActions}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum produto encontrado.</div>}
      showPagination={false}
    />
  );
}
