'use client';

import { TriangleAlert } from 'lucide-react';
import { EMPTY_VALUE, fmtNumber } from '@/features/reportExport/format';
import {
  SortableReportTable,
  type ReportColumn,
} from '@/features/reportExport/SortableReportTable';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/Tooltip';
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

const unitLabel = (unit: string) => UNIT_LABELS[unit] ?? unit;
const QTY_FORMAT = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 });
const fmtQty = (value: number, unit: string) => `${QTY_FORMAT.format(value)} ${unitLabel(unit)}`;

function coverageClass(days: number | null): string | undefined {
  if (days === null) return undefined;
  if (days < COVERAGE_DANGER_DAYS) return 'font-semibold text-red-600';
  if (days < COVERAGE_WARNING_DAYS) return 'font-semibold text-amber-600';
  return undefined;
}

const COLUMNS: ReportColumn<StockItem, Summary>[] = [
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
  {
    key: 'unitPrice',
    label: 'Preço unit.',
    numeric: true,
    cell: (r, f) => f.fmtMoney(r.unitPrice),
  },
  {
    key: 'totalValue',
    label: 'Valor',
    numeric: true,
    cell: (r, f) => f.fmtMoney(r.totalValue),
    total: (s, f) => f.fmtMoney(s.totalValue),
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
    cell: (r, f) =>
      r.shortage > 0
        ? `${fmtQty(r.shortage, r.unit)} · ${f.fmtMoney(r.replenishmentValue)}`
        : EMPTY_VALUE,
    total: (s, f) => f.fmtMoney(s.replenishmentValue),
  },
];

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
  return (
    <SortableReportTable
      title="Posição por item"
      description="Saldo atual; consumo e cobertura calculados na janela informada."
      emptyMessage="Nenhum item de estoque encontrado para os filtros informados."
      itemsLabel="itens"
      rows={items}
      summary={summary}
      columns={COLUMNS}
      getRowKey={(row) => row.stockId}
      ascFirstKey="name"
      firstCellExtra={(row) => <WarningBadge item={row} />}
    />
  );
}
