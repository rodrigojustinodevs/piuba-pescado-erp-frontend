'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/Table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/Tooltip';
import { cn } from '@/shared/lib/utils';
import { WARNING_LABELS } from '../constants';
import type { BatchRow } from '../types';
import { EMPTY_VALUE, fmtKg, fmtMoney, fmtNumber, fmtPct } from '../utils/format';
import { ReportSection, SectionEmpty } from './ReportSection';

type SortKey =
  | 'batchName'
  | 'tankName'
  | 'speciesName'
  | 'days'
  | 'stocked'
  | 'alive'
  | 'deathsPct'
  | 'avgWeightG'
  | 'gpdGPerDay'
  | 'biomassKg'
  | 'densityKgM3'
  | 'feedKg'
  | 'fcr'
  | 'totalCost'
  | 'costPerKg';

type Column = {
  key: SortKey;
  label: string;
  numeric?: boolean;
  render: (row: BatchRow) => string;
};

const COLUMNS: Column[] = [
  { key: 'batchName', label: 'Lote', render: (r) => r.batchName },
  { key: 'tankName', label: 'Tanque', render: (r) => r.tankName },
  { key: 'speciesName', label: 'Espécie', render: (r) => r.speciesName ?? EMPTY_VALUE },
  { key: 'days', label: 'Dias', numeric: true, render: (r) => fmtNumber(r.days) },
  { key: 'stocked', label: 'Povoados', numeric: true, render: (r) => fmtNumber(r.stocked) },
  { key: 'alive', label: 'Vivos', numeric: true, render: (r) => fmtNumber(r.alive) },
  { key: 'deathsPct', label: 'Mortes %', numeric: true, render: (r) => fmtPct(r.deathsPct) },
  {
    key: 'avgWeightG',
    label: 'Peso (g)',
    numeric: true,
    render: (r) => fmtNumber(r.avgWeightG, 1),
  },
  {
    key: 'gpdGPerDay',
    label: 'GPD (g/dia)',
    numeric: true,
    render: (r) => fmtNumber(r.gpdGPerDay, 2),
  },
  { key: 'biomassKg', label: 'Biomassa', numeric: true, render: (r) => fmtKg(r.biomassKg) },
  {
    key: 'densityKgM3',
    label: 'Densidade (kg/m³)',
    numeric: true,
    render: (r) => fmtNumber(r.densityKgM3, 2),
  },
  { key: 'feedKg', label: 'Ração', numeric: true, render: (r) => fmtKg(r.feedKg) },
  { key: 'fcr', label: 'FCA', numeric: true, render: (r) => fmtNumber(r.fcr, 2) },
  { key: 'totalCost', label: 'Custo total', numeric: true, render: (r) => fmtMoney(r.totalCost) },
  { key: 'costPerKg', label: 'Custo/kg', numeric: true, render: (r) => fmtMoney(r.costPerKg) },
];

function compare(a: BatchRow, b: BatchRow, key: SortKey): number {
  const av = a[key];
  const bv = b[key];
  // null sempre por último, independente da direção
  if (av === null && bv === null) return 0;
  if (av === null) return 1;
  if (bv === null) return -1;
  if (typeof av === 'number' && typeof bv === 'number') return av - bv;
  return String(av).localeCompare(String(bv), 'pt-BR');
}

function WarningIcon({ row }: Readonly<{ row: BatchRow }>) {
  if (row.warnings.length === 0) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`Avisos do lote ${row.batchName}: ${row.warnings.length}`}
          className="ml-2 inline-flex rounded text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4]"
        >
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <ul className="list-disc space-y-1 pl-4">
          {row.warnings.map((w) => (
            <li key={w}>{WARNING_LABELS[w] ?? w}</li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}

export function BatchesTable({ batches }: Readonly<{ batches: BatchRow[] }>) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' } | null>(null);

  const rows = useMemo(() => {
    if (!sort) return batches;
    const sign = sort.dir === 'asc' ? 1 : -1;
    return [...batches].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av === null || bv === null) return compare(a, b, sort.key);
      return sign * compare(a, b, sort.key);
    });
  }, [batches, sort]);

  function toggleSort(key: SortKey) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: 'asc' };
      return prev.dir === 'asc' ? { key, dir: 'desc' } : null;
    });
  }

  return (
    <ReportSection
      title="Lotes"
      description="Valores acumulados do povoamento até a data de corte."
    >
      {batches.length === 0 ? (
        <SectionEmpty>Nenhum lote encontrado para os filtros selecionados.</SectionEmpty>
      ) : (
        <TooltipProvider delayDuration={150}>
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map((col) => {
                  const active = sort?.key === col.key;
                  let ariaSort: 'ascending' | 'descending' | 'none' = 'none';
                  if (active) ariaSort = sort.dir === 'asc' ? 'ascending' : 'descending';
                  return (
                    <TableHead
                      key={col.key}
                      aria-sort={ariaSort}
                      className={cn('whitespace-nowrap', col.numeric && 'text-right')}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center gap-1 rounded hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4]"
                      >
                        {col.label}
                        {active &&
                          (sort.dir === 'asc' ? (
                            <ArrowUp className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <ArrowDown className="h-3 w-3" aria-hidden="true" />
                          ))}
                      </button>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.batchId}
                  className={cn(row.aboveMortalityLimit && 'bg-red-50 hover:bg-red-50')}
                >
                  {COLUMNS.map((col, index) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        'whitespace-nowrap',
                        col.numeric && 'text-right tabular-nums',
                        col.key === 'deathsPct' &&
                          row.aboveMortalityLimit &&
                          'font-semibold text-red-600',
                      )}
                    >
                      {col.render(row)}
                      {index === 0 && <WarningIcon row={row} />}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      )}
    </ReportSection>
  );
}
