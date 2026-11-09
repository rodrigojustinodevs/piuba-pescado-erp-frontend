'use client';

import { TriangleAlert } from 'lucide-react';
import { EMPTY_VALUE, fmtNumber } from '@/features/reportExport/format';
import {
  SortableReportTable,
  type ReportColumn,
} from '@/features/reportExport/SortableReportTable';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/Tooltip';
import { cn } from '@/shared/lib/utils';
import { WARNING_LABELS } from '../constants';
import type { Summary, TankRow } from '../types';

const num = (value: number | null, digits: number) =>
  value === null ? EMPTY_VALUE : fmtNumber(value, digits);

function BatchCell({ row }: Readonly<{ row: TankRow }>) {
  if (row.batchNames.length > 0) return <>{row.batchNames.join(', ')}</>;
  if (row.status === 'active') return <span className="text-amber-700">Ocioso</span>;
  return <>{EMPTY_VALUE}</>;
}

function StatusBadge({ status }: Readonly<{ status: TankRow['status'] }>) {
  const active = status === 'active';
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600',
      )}
    >
      {active ? 'Ativo' : 'Inativo'}
    </span>
  );
}

const COLUMNS: ReportColumn<TankRow, Summary>[] = [
  { key: 'name', label: 'Tanque', cell: (r) => r.name, total: () => 'Total' },
  { key: 'typeName', label: 'Tipo', cell: (r) => r.typeName ?? EMPTY_VALUE },
  { key: 'location', label: 'Local', cell: (r) => r.location ?? EMPTY_VALUE },
  { key: 'status', label: 'Situação', cell: (r) => <StatusBadge status={r.status} /> },
  {
    key: 'capacityM3',
    label: 'Volume (m³)',
    numeric: true,
    cell: (r) => num(r.capacityM3, 1),
    total: (s) => num(s.totalCapacityM3, 1),
  },
  {
    key: 'batchNames',
    label: 'Lote(s) ativo(s)',
    cell: (r) => <BatchCell row={r} />,
    sortValue: (r) => r.batchNames.join(', ') || null,
  },
  {
    key: 'oldestBatchDays',
    label: 'Dias',
    numeric: true,
    cell: (r) => (r.occupied ? fmtNumber(r.oldestBatchDays) : EMPTY_VALUE),
  },
  {
    key: 'alive',
    label: 'Vivos',
    numeric: true,
    cell: (r) => (r.occupied ? fmtNumber(r.alive) : EMPTY_VALUE),
    total: (s) => fmtNumber(s.totalAlive),
  },
  {
    key: 'avgWeightG',
    label: 'Peso médio (g)',
    numeric: true,
    cell: (r) => num(r.avgWeightG, 1),
  },
  {
    key: 'biomassKg',
    label: 'Biomassa (kg)',
    numeric: true,
    cell: (r) => num(r.biomassKg, 1),
    total: (s) => num(s.totalBiomassKg, 1),
  },
  {
    key: 'densityKgM3',
    label: 'Densidade (kg/m³)',
    numeric: true,
    cell: (r) => num(r.densityKgM3, 2),
    total: (s) => num(s.avgDensityKgM3, 2),
  },
  { key: 'fishPerM3', label: 'Peixes/m³', numeric: true, cell: (r) => num(r.fishPerM3, 1) },
];

function WarningBadge({ row }: Readonly<{ row: TankRow }>) {
  if (row.warnings.length === 0) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Avisos do tanque"
          className="ml-2 inline-flex rounded text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4]"
        >
          <TriangleAlert className="h-4 w-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <ul className="space-y-1">
          {row.warnings.map((w) => (
            <li key={w}>{WARNING_LABELS[w]}</li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}

export function TankTable({ tanks, summary }: Readonly<{ tanks: TankRow[]; summary: Summary }>) {
  return (
    <SortableReportTable
      title="Ocupação por tanque"
      description="Lotes ativos na data de corte, com os mesmos números do Relatório de Produção."
      emptyMessage="Nenhum tanque encontrado para os filtros informados."
      itemsLabel="tanques"
      rows={tanks}
      summary={summary}
      columns={COLUMNS}
      getRowKey={(row) => row.tankId}
      ascFirstKey="name"
      rowClassName={(row) => (row.status === 'inactive' ? 'bg-slate-50' : undefined)}
      firstCellExtra={(row) => <WarningBadge row={row} />}
    />
  );
}
