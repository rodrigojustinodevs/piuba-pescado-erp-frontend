'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
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
import { TooltipProvider } from '@/shared/components/ui/Tooltip';
import { cn } from '@/shared/lib/utils';
import { fmtNumber } from './format';
import { ReportSection, SectionEmpty } from './ReportSection';

const PAGE_SIZE = 25;

export type ReportColumn<TRow, TSummary, TKey extends string = string> = {
  key: TKey;
  label: string;
  numeric?: boolean;
  cell: (row: TRow) => ReactNode;
  cellClass?: (row: TRow) => string | undefined;
  /** Valor usado na ordenação; `null` vai sempre para o fim. Padrão: `row[key]`. */
  sortValue?: (row: TRow) => number | string | null;
  /** Texto da linha de totais (vindo do `summary` do servidor). */
  total?: (summary: TSummary) => string;
  totalClass?: (summary: TSummary) => string | undefined;
};

type SortState = { key: string; dir: 'asc' | 'desc' } | null;

type Props<TRow, TSummary> = Readonly<{
  title: string;
  description: string;
  emptyMessage: string;
  /** Ex.: "clientes"; usado em "Página 1 de 3 · 80 clientes". */
  itemsLabel: string;
  rows: TRow[];
  summary: TSummary;
  columns: ReportColumn<TRow, TSummary>[];
  getRowKey: (row: TRow) => string;
  /** Coluna cujo primeiro clique ordena de A a Z (as demais começam decrescentes). */
  ascFirstKey: string;
  rowClassName?: (row: TRow) => string | undefined;
  /** Conteúdo extra na primeira célula (ex.: ícone de aviso). */
  firstCellExtra?: (row: TRow) => ReactNode;
}>;

function defaultSortValue<TRow>(row: TRow, key: string): number | string | null {
  const value = (row as Record<string, unknown>)[key];
  return (value ?? null) as number | string | null;
}

function sortRows<TRow, TSummary>(
  rows: TRow[],
  columns: ReportColumn<TRow, TSummary>[],
  sort: NonNullable<SortState>,
): TRow[] {
  const column = columns.find((c) => c.key === sort.key);
  const valueOf = (row: TRow) =>
    column?.sortValue ? column.sortValue(row) : defaultSortValue(row, sort.key);
  const sign = sort.dir === 'asc' ? 1 : -1;
  // null sempre por último, independente da direção
  const withValue = rows.filter((r) => valueOf(r) !== null);
  const withoutValue = rows.filter((r) => valueOf(r) === null);
  withValue.sort((a, b) => {
    const av = valueOf(a);
    const bv = valueOf(b);
    if (typeof av === 'number' && typeof bv === 'number') return sign * (av - bv);
    return sign * String(av).localeCompare(String(bv), 'pt-BR');
  });
  return [...withValue, ...withoutValue];
}

/** Tabela de relatório com ordenação e paginação locais e linha de totais opcional. */
export function SortableReportTable<TRow, TSummary>({
  title,
  description,
  emptyMessage,
  itemsLabel,
  rows,
  summary,
  columns,
  getRowKey,
  ascFirstKey,
  rowClassName,
  firstCellExtra,
}: Props<TRow, TSummary>) {
  // A ordem inicial é a do servidor.
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(1);

  const sorted = useMemo(
    () => (sort ? sortRows(rows, columns, sort) : rows),
    [rows, columns, sort],
  );
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasTotals = columns.some((c) => c.total);

  function toggleSort(key: string) {
    setPage(1);
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: key === ascFirstKey ? 'asc' : 'desc' };
      if (prev.dir === 'desc') return { key, dir: 'asc' };
      return null;
    });
  }

  return (
    <ReportSection title={title} description={description}>
      {rows.length === 0 ? (
        <SectionEmpty>{emptyMessage}</SectionEmpty>
      ) : (
        <TooltipProvider delayDuration={150}>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => {
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
                <TableRow key={getRowKey(row)} className={rowClassName?.(row)}>
                  {columns.map((col, index) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        'whitespace-nowrap',
                        col.numeric && 'text-right tabular-nums',
                        col.cellClass?.(row),
                      )}
                    >
                      {col.cell(row)}
                      {index === 0 && firstCellExtra?.(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            {hasTotals && (
              <TableFooter>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        'whitespace-nowrap font-semibold',
                        col.numeric && 'text-right tabular-nums',
                        col.totalClass?.(summary),
                      )}
                    >
                      {col.total ? col.total(summary) : ''}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TooltipProvider>
      )}

      {pageCount > 1 && (
        <nav
          aria-label={`Paginação da tabela de ${itemsLabel}`}
          className="mt-4 flex items-center justify-between text-sm text-slate-600"
        >
          <span>
            Página {currentPage} de {pageCount} · {fmtNumber(sorted.length)} {itemsLabel}
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
