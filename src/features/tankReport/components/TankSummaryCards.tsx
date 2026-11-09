import { AlertTriangle } from 'lucide-react';
import { StatCard } from '@/shared/components/Cards/StatCard';
import { fmtNumber, fmtPct } from '@/features/reportExport/format';
import type { Summary } from '../types';

export function TankSummaryCards({ summary }: Readonly<{ summary: Summary }>) {
  const cards: { label: string; value: string; subtitle?: string; warn?: boolean }[] = [
    {
      label: 'Tanques',
      value: fmtNumber(summary.tanks),
      subtitle: `${fmtNumber(summary.activeTanks)} ativos · ${fmtNumber(summary.inactiveTanks)} inativos`,
    },
    { label: 'Com lote ativo', value: fmtNumber(summary.occupiedTanks) },
    {
      label: 'Ociosos',
      value: fmtNumber(summary.idleTanks),
      subtitle: 'ativos sem lote ativo',
      warn: summary.idleTanks > 0,
    },
    { label: 'Ocupação', value: fmtPct(summary.occupancyPct), subtitle: 'dos tanques ativos' },
    {
      label: 'Ocupação por volume',
      value: fmtPct(summary.volumeOccupancyPct),
      subtitle: `${fmtNumber(summary.occupiedCapacityM3, 1)} de ${fmtNumber(summary.totalCapacityM3, 1)} m³`,
    },
    { label: 'Volume total', value: `${fmtNumber(summary.totalCapacityM3, 1)} m³` },
    { label: 'Peixes vivos', value: fmtNumber(summary.totalAlive) },
    { label: 'Biomassa', value: `${fmtNumber(summary.totalBiomassKg, 1)} kg` },
    {
      label: 'Densidade média',
      value:
        summary.avgDensityKgM3 === null ? '—' : `${fmtNumber(summary.avgDensityKgM3, 2)} kg/m³`,
    },
  ];

  return (
    <div className="space-y-3">
      {summary.tanksWithoutBiometry > 0 && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            {fmtNumber(summary.tanksWithoutBiometry)} tanque(s) com lote sem biometria: biomassa e
            densidade indisponíveis ou parciais.
          </p>
        </div>
      )}
      {summary.inactiveWithBatch > 0 && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{fmtNumber(summary.inactiveWithBatch)} tanque(s) inativo(s) com lote ativo.</p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            subtitle={card.subtitle}
            icon={null}
            valueClassName={card.warn ? 'text-amber-600' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
