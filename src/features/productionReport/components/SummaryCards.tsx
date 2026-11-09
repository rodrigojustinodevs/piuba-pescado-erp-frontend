import { AlertTriangle } from 'lucide-react';
import { StatCard } from '@/shared/components/Cards/StatCard';
import type { Summary } from '../types';
import { fmtKg, fmtMoney, fmtNumber, fmtPct } from '@/features/reportExport/format';

export function SummaryCards({ summary }: Readonly<{ summary: Summary }>) {
  const cards: { label: string; value: string; subtitle?: string; danger?: boolean }[] = [
    {
      label: 'Lotes',
      value: fmtNumber(summary.batches),
      subtitle: `${fmtNumber(summary.activeBatches)} ativos`,
    },
    { label: 'Povoados', value: fmtNumber(summary.stocked) },
    { label: 'Vivos', value: fmtNumber(summary.alive) },
    {
      label: 'Sobrevivência',
      value: fmtPct(summary.survivalPct),
      subtitle: 'ponderada por povoados',
    },
    {
      label: 'Mortalidade',
      value: fmtPct(summary.deathsPct),
      subtitle: `${fmtNumber(summary.deaths)} mortes`,
    },
    {
      label: 'Lotes acima do limite',
      value: fmtNumber(summary.batchesAboveMortalityLimit),
      subtitle: `limite de mortalidade: ${fmtPct(summary.mortalityLimitPct, 0)}`,
      danger: summary.batchesAboveMortalityLimit > 0,
    },
    { label: 'Biomassa', value: fmtKg(summary.biomassKg) },
    { label: 'Despescado', value: fmtKg(summary.harvestedKg) },
    { label: 'Ração', value: fmtKg(summary.feedKg) },
    { label: 'FCA', value: fmtNumber(summary.fcr, 2), subtitle: 'ponderado por biomassa' },
    { label: 'Custo total', value: fmtMoney(summary.totalCost) },
    { label: 'Custo por kg', value: fmtMoney(summary.costPerKg) },
  ];

  return (
    <div className="space-y-3">
      {summary.feedingsWithoutCost > 0 && (
        <output className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {fmtNumber(summary.feedingsWithoutCost)} alimentações sem estoque vinculado: custo da
            ração subestimado.
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
