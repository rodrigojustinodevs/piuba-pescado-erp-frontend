'use client';

import { SEVERITY_LABELS, CAUSE_LABELS, type Mortality, type MortalitySeverity } from '../types';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Badge } from '@/src/shared/components/ui/Badge';

function formatNumber(value: number): string {
  return Number.isFinite(value) ? String(value) : '—';
}

const SEVERITY_STYLES: Record<MortalitySeverity, string> = {
  low: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  high: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30',
  critical: 'bg-destructive/15 text-destructive border-destructive/40',
};

export interface MortalityTableProps {
  mortalities: Mortality[];
  getRowActions: (row: Mortality) => DataTableAction[];
}

export function MortalityTable({ mortalities, getRowActions }: Readonly<MortalityTableProps>) {
  const columns: Array<DataTableColumn<Mortality>> = [
    {
      id: 'batchName',
      header: 'Lote',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A]">{row.batch?.name || '—'}</div>
      ),
    },
    {
      id: 'mortalityDate',
      header: 'Data',
      cell: (row) => (
        <div className="text-sm text-slate-600">{formatNullableDatePtBR(row.mortalityDate)}</div>
      ),
    },
    {
      id: 'quantity',
      header: 'Quantidade',
      headerClassName: 'text-right',
      cellClassName: 'text-right font-medium',
      cell: (row) => <div className="text-sm text-slate-600">{formatNumber(row.quantity)}</div>,
    },
    {
      id: 'batchPercentage',
      header: '% do Lote',
      headerClassName: 'text-right',
      cellClassName: 'text-right text-muted-foreground',
      cell: (row) => <div>{formatNumber(row.batchPercentage)}%</div>,
    },
    {
      id: 'cause',
      header: 'Causa',
      cell: (row) => {
        return CAUSE_LABELS[row.cause];
      },
    },
    {
      id: 'severity',
      header: 'Severidade',
      cell: (row) => (
        <Badge variant="outline" className={SEVERITY_STYLES[row.severity]}>
          {SEVERITY_LABELS[row.severity]}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      data={mortalities}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={getRowActions}
      emptyState={
        <div className="p-8 text-center text-slate-500">
          Nenhum registro de mortalidade encontrado.
        </div>
      }
    />
  );
}
