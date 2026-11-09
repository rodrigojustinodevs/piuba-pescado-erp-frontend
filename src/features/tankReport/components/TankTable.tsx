'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, TriangleAlert } from 'lucide-react';
import { EMPTY_VALUE, fmtNumber } from '@/features/reportExport/format';
import { ReportSection, SectionEmpty } from '@/features/reportExport/ReportSection';
import { Button } from '@/shared/components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
import type { Summary, TankRow } from '../types';

const PAGE_SIZE = 25;

type SortKey =
  | 'name'
  | 'typeName'
  | 'location'
  | 'status'
  | 'capacityM3'
  | 'batchNames'
  | 'oldestBatchDays'
  | 'alive'
  | 'avgWeightG'
  | 'biomassKg'
  | 'densityKgM3'
  | 'fishPerM3';

type Column = {
  key: SortKey;
  label: string;
  numeric?: boolean;
  cell: (row: TankRow) => ReactNode;
  total?: (summary: Summary) => string;
};

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

const COLUMNS: Column[] = [
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
  { key: 'batchNames', label: 'Lote(s) ativo(s)', cell: (r) => <BatchCell row={r} /> },
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

function sortValue(row: TankRow, key: SortKey): number | string | null {
  if (key === 'batchNames') return row.batchNames.join(', ') || null;
  return row[key];
}

function sortRows(rows: TankRow[], sort: { key: SortKey; dir: 'asc' | 'desc' }): TankRow[] {
  const sign = sort.dir === 'asc' ? 1 : -1;
  // null sempre por último, independente da direção
  const withValue = rows.filter((r) => sortValue(r, sort.key) !== null);
  const withoutValue = rows.filter((r) => sortValue(r, sort.key) === null);
  withValue.sort((a, b) => {
    const av = sortValue(a, sort.key);
    const bv = sortValue(b, sort.key);
    if (typeof av === 'number' && typeof bv === 'number') return sign * (av - bv);
    return sign * String(av).localeCompare(String(bv), 'pt-BR');
  });
  return [...withValue, ...withoutValue];
}

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
  // O servidor já ordena alfabeticamente pelo nome.
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => (sort ? sortRows(tanks, sort) : tanks), [tanks, sort]);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    setPage(1);
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: key === 'name' ? 'asc' : 'desc' };
      if (prev.dir === 'desc') return { key, dir: 'asc' };
      return null;
    });
  }

  return (
    <ReportSection
      title="Ocupação por tanque"
      description="Lotes ativos na data de corte, com os mesmos números do Relatório de Produção."
    >
      {tanks.length === 0 ? (
        <SectionEmpty>Nenhum tanque encontrado para os filtros informados.</SectionEmpty>
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
              {visible.map((row) => (
                <TableRow
                  key={row.tankId}
                  className={cn(row.status === 'inactive' && 'bg-slate-50')}
                >
                  {COLUMNS.map((col, index) => (
                    <TableCell
                      key={col.key}
                      className={cn('whitespace-nowrap', col.numeric && 'text-right tabular-nums')}
                    >
                      {col.cell(row)}
                      {index === 0 && <WarningBadge row={row} />}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      'whitespace-nowrap font-semibold',
                      col.numeric && 'text-right tabular-nums',
                    )}
                  >
                    {col.total ? col.total(summary) : ''}
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
          </Table>
        </TooltipProvider>
      )}

      {pageCount > 1 && (
        <nav
          aria-label="Paginação da tabela de tanques"
          className="mt-4 flex items-center justify-between text-sm text-slate-600"
        >
          <span>
            Página {currentPage} de {pageCount} · {fmtNumber(rows.length)} tanques
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pageCount}
              onClick={() => setPage(currentPage + 1)}
            >
              Próxima
            </Button>
          </div>
        </nav>
      )}
    </ReportSection>
  );
}
