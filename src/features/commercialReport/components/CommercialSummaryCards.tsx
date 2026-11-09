import { AlertTriangle } from 'lucide-react';
import { StatCard } from '@/shared/components/Cards/StatCard';
import { fmtNumber, fmtPct } from '@/features/reportExport/format';
import { useReportFormatters } from '@/features/reportExport/useReportFormatters';
import type { Summary } from '../types';

export function CommercialSummaryCards({ summary }: Readonly<{ summary: Summary }>) {
  const { fmtKg, fmtMoney } = useReportFormatters();
  const cards: { label: string; value: string; subtitle?: string; danger?: boolean }[] = [
    {
      label: 'Vendas',
      value: fmtNumber(summary.sales),
      subtitle: `${fmtNumber(summary.clients)} clientes`,
    },
    { label: 'Peso vendido', value: fmtKg(summary.kg) },
    { label: 'Receita bruta', value: fmtMoney(summary.grossRevenue) },
    {
      label: 'Receita líquida',
      value: fmtMoney(summary.netRevenue),
      subtitle: 'bruta − descontos − impostos',
    },
    { label: 'Preço médio/kg', value: fmtMoney(summary.avgPricePerKg) },
    { label: 'Ticket médio', value: fmtMoney(summary.avgTicket) },
    {
      label: 'Recebido',
      value: fmtMoney(summary.received),
      subtitle: `${fmtPct(summary.receivedPct)} da receita bruta`,
    },
    { label: 'Em aberto', value: fmtMoney(summary.openAmount) },
    {
      label: 'Vencido',
      value: fmtMoney(summary.overdueAmount),
      subtitle: `${fmtNumber(summary.clientsWithOverdue)} clientes com vencido`,
      danger: summary.overdueAmount > 0,
    },
    { label: 'Descontos', value: fmtMoney(summary.discount) },
    { label: 'Impostos', value: fmtMoney(summary.taxes) },
    { label: 'Frete', value: fmtMoney(summary.shipping), subtitle: 'fora da receita líquida' },
  ];

  return (
    <div className="space-y-3">
      {summary.cancelledSales > 0 && (
        <output className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {fmtNumber(summary.cancelledSales)} venda(s) cancelada(s) no período (
            {fmtMoney(summary.cancelledValue)}), fora de todos os totais.
          </span>
        </output>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            subtitle={card.subtitle}
            icon={null}
            valueClassName={card.danger ? 'text-red-600' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
