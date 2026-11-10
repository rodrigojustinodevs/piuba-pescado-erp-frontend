import { AlertTriangle } from 'lucide-react';
import { StatCard } from '@/shared/components/Cards/StatCard';
import { fmtNumber, fmtPct } from '@/features/reportExport/format';
import { useReportFormatters } from '@/features/reportExport/useReportFormatters';
import type { Summary } from '../types';

type CardData = { label: string; value: string; subtitle?: string; danger?: boolean };

function Group({ title, cards }: Readonly<{ title: string; cards: CardData[] }>) {
  return (
    <section aria-label={title} className="space-y-2">
      <h2 className="text-sm font-semibold text-slate-600">{title}</h2>
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
    </section>
  );
}

function Note({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <output className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </output>
  );
}

export function FinancialSummaryCards({ summary }: Readonly<{ summary: Summary }>) {
  const { fmtMoney } = useReportFormatters();
  const realized: CardData[] = [
    { label: 'Receita realizada', value: fmtMoney(summary.revenueRealized) },
    { label: 'Despesa realizada', value: fmtMoney(summary.expenseRealized) },
    {
      label: 'Resultado realizado',
      value: fmtMoney(summary.resultRealized),
      danger: summary.resultRealized < 0,
    },
    { label: 'Margem realizada', value: fmtPct(summary.marginRealizedPct) },
  ];
  const forecast: CardData[] = [
    { label: 'A receber', value: fmtMoney(summary.revenueForecast) },
    { label: 'A pagar', value: fmtMoney(summary.expenseForecast) },
    {
      label: 'Resultado previsto',
      value: fmtMoney(summary.resultForecast),
      danger: summary.resultForecast < 0,
    },
    {
      label: 'Resultado projetado',
      value: fmtMoney(summary.resultProjected),
      subtitle: `margem projetada ${fmtPct(summary.marginProjectedPct)}`,
      danger: summary.resultProjected < 0,
    },
  ];
  const attention: CardData[] = [
    {
      label: 'A receber vencido',
      value: fmtMoney(summary.overdueReceivable),
      danger: summary.overdueReceivable > 0,
    },
    {
      label: 'A pagar vencido',
      value: fmtMoney(summary.overduePayable),
      danger: summary.overduePayable > 0,
    },
  ];

  return (
    <div className="space-y-4">
      {summary.cancelledCount > 0 && (
        <Note>
          {fmtNumber(summary.cancelledCount)} lançamento(s) cancelado(s) (
          {fmtMoney(summary.cancelledValue)}), fora de todos os totais.
        </Note>
      )}
      {summary.otherTypesCount > 0 && (
        <Note>
          {fmtNumber(summary.otherTypesCount)} lançamento(s) de investimento, compra ou
          transferência ({fmtMoney(summary.otherTypesValue)}) não entram no resultado.
        </Note>
      )}
      <Group title="Realizado (pago até a data de corte)" cards={realized} />
      <Group title="Previsto (em aberto na data de corte)" cards={forecast} />
      <Group title="Atenção" cards={attention} />
    </div>
  );
}
