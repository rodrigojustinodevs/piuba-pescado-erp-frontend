import { AlertTriangle } from 'lucide-react';
import { StatCard } from '@/shared/components/Cards/StatCard';
import { fmtNumber } from '@/features/reportExport/format';
import { useReportFormatters } from '@/features/reportExport/useReportFormatters';
import type { Summary } from '../types';

export function InventorySummaryCards({ summary }: Readonly<{ summary: Summary }>) {
  const { fmtMoney } = useReportFormatters();
  const cards: { label: string; value: string; subtitle?: string; danger?: boolean }[] = [
    { label: 'Itens', value: fmtNumber(summary.items) },
    { label: 'Valor em estoque', value: fmtMoney(summary.totalValue) },
    {
      label: 'Abaixo do mínimo',
      value: fmtNumber(summary.itemsBelowMinimum),
      danger: summary.itemsBelowMinimum > 0,
    },
    { label: 'Zerados', value: fmtNumber(summary.itemsZero), danger: summary.itemsZero > 0 },
    {
      label: 'Reposição estimada',
      value: fmtMoney(summary.replenishmentValue),
      subtitle: 'custo para repor até o mínimo',
    },
    {
      label: 'Janela de consumo',
      value: `${fmtNumber(summary.windowDays)} dias`,
    },
  ];

  const notes: string[] = [];
  if (summary.itemsNegative > 0) {
    notes.push(
      `${fmtNumber(summary.itemsNegative)} item(ns) com saldo negativo: o valor é contado como zero.`,
    );
  }
  if (summary.itemsWithoutPrice > 0) {
    notes.push(
      `${fmtNumber(summary.itemsWithoutPrice)} item(ns) sem preço unitário: o valor em estoque está subestimado.`,
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <output
          key={note}
          className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{note}</span>
        </output>
      ))}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
