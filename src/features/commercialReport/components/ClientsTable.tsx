'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ShieldAlert } from 'lucide-react';
import { EMPTY_VALUE, fmtKg, fmtMoney, fmtNumber, fmtPct } from '@/features/reportExport/format';
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
import { formatCalendarDatePtBR } from '@/shared/utils/dateFormat';
import type { ClientRow, Summary } from '../types';

const PAGE_SIZE = 25;

type SortKey = Exclude<
  keyof ClientRow,
  'clientId' | 'tradeName' | 'isDefaulter' | 'discount' | 'taxes' | 'shipping' | 'creditLimit'
>;

type Column = {
  key: SortKey;
  label: string;
  numeric?: boolean;
  render: (row: ClientRow) => string;
  total?: (summary: Summary) => string;
  danger?: (row: ClientRow) => boolean;
};

const COLUMNS: Column[] = [
  {
    key: 'clientName',
    label: 'Cliente',
    render: (r) => r.tradeName ?? r.clientName,
    total: () => 'Total',
  },
  {
    key: 'sales',
    label: 'Vendas',
    numeric: true,
    render: (r) => fmtNumber(r.sales),
    total: (s) => fmtNumber(s.sales),
  },
  {
    key: 'kg',
    label: 'Peso',
    numeric: true,
    render: (r) => fmtKg(r.kg),
    total: (s) => fmtKg(s.kg),
  },
  {
    key: 'grossRevenue',
    label: 'Receita bruta',
    numeric: true,
    render: (r) => fmtMoney(r.grossRevenue),
    total: (s) => fmtMoney(s.grossRevenue),
  },
  {
    key: 'netRevenue',
    label: 'Receita líquida',
    numeric: true,
    render: (r) => fmtMoney(r.netRevenue),
    total: (s) => fmtMoney(s.netRevenue),
  },
  { key: 'sharePct', label: 'Participação', numeric: true, render: (r) => fmtPct(r.sharePct) },
  {
    key: 'avgPricePerKg',
    label: 'Preço/kg',
    numeric: true,
    render: (r) => fmtMoney(r.avgPricePerKg),
    total: (s) => fmtMoney(s.avgPricePerKg),
  },
  {
    key: 'avgTicket',
    label: 'Ticket médio',
    numeric: true,
    render: (r) => fmtMoney(r.avgTicket),
    total: (s) => fmtMoney(s.avgTicket),
  },
  {
    key: 'received',
    label: 'Recebido',
    numeric: true,
    render: (r) => fmtMoney(r.received),
    total: (s) => fmtMoney(s.received),
  },
  {
    key: 'openAmount',
    label: 'Em aberto',
    numeric: true,
    render: (r) => fmtMoney(r.openAmount),
    total: (s) => fmtMoney(s.openAmount),
  },
  {
    key: 'overdueAmount',
    label: 'Vencido',
    numeric: true,
    render: (r) => fmtMoney(r.overdueAmount),
    total: (s) => fmtMoney(s.overdueAmount),
    danger: (r) => r.overdueAmount > 0,
  },
  {
    key: 'lastSaleDate',
    label: 'Última venda',
    render: (r) => (r.lastSaleDate ? formatCalendarDatePtBR(r.lastSaleDate) : EMPTY_VALUE),
  },
  {
    key: 'creditUsagePct',
    label: 'Uso do limite',
    numeric: true,
    render: (r) => fmtPct(r.creditUsagePct),
    danger: (r) => (r.creditUsagePct ?? 0) > 100,
  },
];

function compare(a: ClientRow, b: ClientRow, key: SortKey): number {
  const av = a[key];
  const bv = b[key];
  if (typeof av === 'number' && typeof bv === 'number') return av - bv;
  return String(av).localeCompare(String(bv), 'pt-BR');
}

function sortRows(rows: ClientRow[], sort: { key: SortKey; dir: 'asc' | 'desc' }): ClientRow[] {
  const sign = sort.dir === 'asc' ? 1 : -1;
  // null sempre por último, independente da direção
  const withValue = rows.filter((r) => r[sort.key] !== null);
  const withoutValue = rows.filter((r) => r[sort.key] === null);
  withValue.sort((a, b) => sign * compare(a, b, sort.key));
  return [...withValue, ...withoutValue];
}

function DefaulterBadge() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Inadimplente (cadastro)"
          className="ml-2 inline-flex rounded text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4]"
        >
          <ShieldAlert className="h-4 w-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        Inadimplente (cadastro): marcação do cadastro do cliente, pode divergir da coluna
        &quot;Vencido&quot;.
      </TooltipContent>
    </Tooltip>
  );
}

export function ClientsTable({
  clients,
  summary,
}: Readonly<{ clients: ClientRow[]; summary: Summary }>) {
  // O servidor já ordena por receita bruta (maior primeiro).
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => (sort ? sortRows(clients, sort) : clients), [clients, sort]);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    setPage(1);
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: key === 'clientName' ? 'asc' : 'desc' };
      if (prev.dir === 'desc') return { key, dir: 'asc' };
      return null;
    });
  }

  return (
    <ReportSection
      title="Vendas por cliente"
      description="Ordenado por receita bruta. Recebido, em aberto e vencido consideram a data de corte."
    >
      {clients.length === 0 ? (
        <SectionEmpty>Nenhuma venda encontrada para os filtros informados.</SectionEmpty>
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
                <TableRow key={row.clientId}>
                  {COLUMNS.map((col, index) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        'whitespace-nowrap',
                        col.numeric && 'text-right tabular-nums',
                        col.danger?.(row) && 'font-semibold text-red-600',
                      )}
                    >
                      {col.render(row)}
                      {index === 0 && row.isDefaulter && <DefaulterBadge />}
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
                      col.key === 'overdueAmount' && summary.overdueAmount > 0 && 'text-red-600',
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
          aria-label="Paginação da tabela de clientes"
          className="mt-4 flex items-center justify-between text-sm text-slate-600"
        >
          <span>
            Página {currentPage} de {pageCount} · {fmtNumber(rows.length)} clientes
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
