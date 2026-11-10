'use client';

import { ShieldAlert } from 'lucide-react';
import { EMPTY_VALUE, fmtNumber, fmtPct } from '@/features/reportExport/format';
import {
  SortableReportTable,
  type ReportColumn,
} from '@/features/reportExport/SortableReportTable';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/Tooltip';
import { formatCalendarDatePtBR } from '@/shared/utils/dateFormat';
import type { ClientRow, Summary } from '../types';

const DANGER_CLASS = 'font-semibold text-red-600';

const COLUMNS: ReportColumn<ClientRow, Summary>[] = [
  {
    key: 'clientName',
    label: 'Cliente',
    cell: (r) => r.tradeName ?? r.clientName,
    total: () => 'Total',
  },
  {
    key: 'sales',
    label: 'Vendas',
    numeric: true,
    cell: (r) => fmtNumber(r.sales),
    total: (s) => fmtNumber(s.sales),
  },
  {
    key: 'kg',
    label: 'Peso',
    numeric: true,
    cell: (r, f) => f.fmtKg(r.kg),
    total: (s, f) => f.fmtKg(s.kg),
  },
  {
    key: 'grossRevenue',
    label: 'Receita bruta',
    numeric: true,
    cell: (r, f) => f.fmtMoney(r.grossRevenue),
    total: (s, f) => f.fmtMoney(s.grossRevenue),
  },
  {
    key: 'netRevenue',
    label: 'Receita líquida',
    numeric: true,
    cell: (r, f) => f.fmtMoney(r.netRevenue),
    total: (s, f) => f.fmtMoney(s.netRevenue),
  },
  { key: 'sharePct', label: 'Participação', numeric: true, cell: (r) => fmtPct(r.sharePct) },
  {
    key: 'avgPricePerKg',
    label: 'Preço/kg',
    numeric: true,
    cell: (r, f) => f.fmtMoney(r.avgPricePerKg),
    total: (s, f) => f.fmtMoney(s.avgPricePerKg),
  },
  {
    key: 'avgTicket',
    label: 'Ticket médio',
    numeric: true,
    cell: (r, f) => f.fmtMoney(r.avgTicket),
    total: (s, f) => f.fmtMoney(s.avgTicket),
  },
  {
    key: 'received',
    label: 'Recebido',
    numeric: true,
    cell: (r, f) => f.fmtMoney(r.received),
    total: (s, f) => f.fmtMoney(s.received),
  },
  {
    key: 'openAmount',
    label: 'Em aberto',
    numeric: true,
    cell: (r, f) => f.fmtMoney(r.openAmount),
    total: (s, f) => f.fmtMoney(s.openAmount),
  },
  {
    key: 'overdueAmount',
    label: 'Vencido',
    numeric: true,
    cell: (r, f) => f.fmtMoney(r.overdueAmount),
    total: (s, f) => f.fmtMoney(s.overdueAmount),
    totalClass: (s) => (s.overdueAmount > 0 ? DANGER_CLASS : undefined),
    cellClass: (r) => (r.overdueAmount > 0 ? DANGER_CLASS : undefined),
  },
  {
    key: 'lastSaleDate',
    label: 'Última venda',
    cell: (r) => (r.lastSaleDate ? formatCalendarDatePtBR(r.lastSaleDate) : EMPTY_VALUE),
  },
  {
    key: 'creditUsagePct',
    label: 'Uso do limite',
    numeric: true,
    cell: (r) => fmtPct(r.creditUsagePct),
    cellClass: (r) => ((r.creditUsagePct ?? 0) > 100 ? DANGER_CLASS : undefined),
  },
];

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
  return (
    <SortableReportTable
      title="Vendas por cliente"
      description="Ordenado por receita bruta. Recebido, em aberto e vencido consideram a data de corte."
      emptyMessage="Nenhuma venda encontrada para os filtros informados."
      itemsLabel="clientes"
      rows={clients}
      summary={summary}
      columns={COLUMNS}
      getRowKey={(row) => row.clientId}
      ascFirstKey="clientName"
      firstCellExtra={(row) => (row.isDefaulter ? <DefaulterBadge /> : null)}
    />
  );
}
