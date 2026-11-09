'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, TriangleAlert } from 'lucide-react';
import { EMPTY_VALUE, fmtMoney, fmtNumber } from '@/features/reportExport/format';
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
import {
  CATEGORY_LABELS,
  COVERAGE_DANGER_DAYS,
  COVERAGE_WARNING_DAYS,
  SITUATION_LABELS,
  STOCK_TYPE_LABELS,
  UNIT_LABELS,
  WARNING_LABELS,
} from '../constants';
import type { StockItem, Summary } from '../types';

const PAGE_SIZE = 25;

type SortKey =
  | 'name'
  | 'category'
  | 'location'
  | 'quantity'
  | 'minimumStock'
  | 'unitPrice'
  | 'totalValue'
  | 'situation'
  | 'avgDailyConsumption'
  | 'coverageDays'
  | 'shortage';

const unitLabel = (unit: string) => UNIT_LABELS[unit] ?? unit;
const QTY_FORMAT = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 });
const fmtQty = (value: number, unit: string) => `${QTY_FORMAT.format(value)} ${unitLabel(unit)}`;

function coverageClass(days: number | null): string | undefined {
  if (days === null) return undefined;
  if (days < COVERAGE_DANGER_DAYS) return 'font-semibold text-red-600';
  if (days < COVERAGE_WARNING_DAYS) return 'font-semibold text-amber-600';
  return undefined;
}

type Column = {
  key: SortKey;
  label: string;
  numeric?: boolean;
  cell: (row: StockItem) => React.ReactNode;
  cellClass?: (row: StockItem) => string | undefined;
  total?: (summary: Summary) => string;
};

const COLUMNS: Column[] = [
  {
    key: 'name',
    label: 'Insumo',
    cell: (r) => r.name,
    total: () => 'Total',
  },
  {
    key: 'category',
    label: 'Categoria',
    cell: (r) => (r.category ? CATEGORY_LABELS[r.category] : EMPTY_VALUE),
  },
  {
    key: 'location',
    label: 'Local',
    cell: (r) => r.location ?? (r.stockType ? STOCK_TYPE_LABELS[r.stockType] : EMPTY_VALUE),
  },
  {
    key: 'quantity',
    label: 'Saldo',
    numeric: true,
    cell: (r) => fmtQty(r.quantity, r.unit),
    cellClass: (r) => (r.quantity < 0 ? 'font-semibold text-red-600' : undefined),
  },
  {
    key: 'minimumStock',
    label: 'Mínimo',
    numeric: true,
    cell: (r) => fmtQty(r.minimumStock, r.unit),
  },
  { key: 'unitPrice', label: 'Preço unit.', numeric: true, cell: (r) => fmtMoney(r.unitPrice) },
  {
    key: 'totalValue',
    label: 'Valor',
    numeric: true,
    cell: (r) => fmtMoney(r.totalValue),
    total: (s) => fmtMoney(s.totalValue),
  },
  {
    key: 'situation',
    label: 'Situação',
    cell: (r) => SITUATION_LABELS[r.situation],
    cellClass: (r) => (r.situation === 'ok' ? undefined : 'font-semibold text-red-600'),
  },
  {
    key: 'avgDailyConsumption',
    label: 'Consumo/dia',
    numeric: true,
    cell: (r) =>
      r.avgDailyConsumption === null ? EMPTY_VALUE : fmtQty(r.avgDailyConsumption, r.unit),
  },
  {
    key: 'coverageDays',
    label: 'Cobertura (dias)',
    numeric: true,
    cell: (r) => (r.coverageDays === null ? EMPTY_VALUE : fmtNumber(r.coverageDays, 1)),
    cellClass: (r) => coverageClass(r.coverageDays),
  },
  {
    key: 'shortage',
    label: 'Falta / reposição',
    numeric: true,
    cell: (r) =>
      r.shortage > 0
        ? `${fmtQty(r.shortage, r.unit)} · ${fmtMoney(r.replenishmentValue)}`
        : EMPTY_VALUE,
    total: (s) => fmtMoney(s.replenishmentValue),
  },
];

function compare(a: StockItem, b: StockItem, key: SortKey): number {
  const av = a[key];
  const bv = b[key];
  if (typeof av === 'number' && typeof bv === 'number') return av - bv;
  return String(av ?? '').localeCompare(String(bv ?? ''), 'pt-BR');
}

function sortRows(rows: StockItem[], sort: { key: SortKey; dir: 'asc' | 'desc' }): StockItem[] {
  const sign = sort.dir === 'asc' ? 1 : -1;
  // null sempre por último, independente da direção
  const withValue = rows.filter((r) => r[sort.key] !== null);
  const withoutValue = rows.filter((r) => r[sort.key] === null);
  withValue.sort((a, b) => sign * compare(a, b, sort.key));
  return [...withValue, ...withoutValue];
}

function WarningBadge({ item }: Readonly<{ item: StockItem }>) {
  if (item.warnings.length === 0) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Avisos do item"
          className="ml-2 inline-flex rounded text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4]"
        >
          <TriangleAlert className="h-4 w-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <ul className="space-y-1">
          {item.warnings.map((w) => (
            <li key={w}>{WARNING_LABELS[w]}</li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}

export function InventoryTable({
  items,
  summary,
}: Readonly<{ items: StockItem[]; summary: Summary }>) {
  // O servidor já ordena: zerados, abaixo do mínimo, normais; menor cobertura primeiro.
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => (sort ? sortRows(items, sort) : items), [items, sort]);
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
      title="Posição por item"
      description="Saldo atual; consumo e cobertura calculados na janela informada."
    >
      {items.length === 0 ? (
        <SectionEmpty>Nenhum item de estoque encontrado para os filtros informados.</SectionEmpty>
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
                <TableRow key={row.stockId}>
                  {COLUMNS.map((col, index) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        'whitespace-nowrap',
                        col.numeric && 'text-right tabular-nums',
                        col.cellClass?.(row),
                      )}
                    >
                      {col.cell(row)}
                      {index === 0 && <WarningBadge item={row} />}
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
          aria-label="Paginação da tabela de estoque"
          className="mt-4 flex items-center justify-between text-sm text-slate-600"
        >
          <span>
            Página {currentPage} de {pageCount} · {fmtNumber(rows.length)} itens
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
