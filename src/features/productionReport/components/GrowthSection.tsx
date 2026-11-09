'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/shared/lib/utils';
import { formatCalendarDatePtBR } from '@/shared/utils/dateFormat';
import { GROWTH_DEVIATION_ALERT_PCT } from '../constants';
import type { GrowthPoint } from '../types';
import { EMPTY_VALUE, fmtNumber, fmtPct } from '@/features/reportExport/format';
import { ReportSection, SectionEmpty } from '@/features/reportExport/ReportSection';

const GrowthChart = dynamic(() => import('./GrowthChart'), {
  ssr: false,
  loading: () => <div className="h-80 animate-pulse rounded-lg bg-slate-100" aria-hidden="true" />,
});

export function GrowthSection({ points }: Readonly<{ points: GrowthPoint[] }>) {
  return (
    <ReportSection
      title="Crescimento"
      description="Peso real × esperado (últimas biometrias por lote no período)."
    >
      {points.length === 0 ? (
        <SectionEmpty>Nenhuma biometria no período.</SectionEmpty>
      ) : (
        <>
          <GrowthChart points={points} />
          <div className="mt-4 max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Biometrias e desvio em relação à curva esperada</caption>
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th scope="col" className="p-2 font-medium">
                    Lote
                  </th>
                  <th scope="col" className="p-2 font-medium">
                    Data
                  </th>
                  <th scope="col" className="p-2 text-right font-medium">
                    Dia
                  </th>
                  <th scope="col" className="p-2 text-right font-medium">
                    Real (g)
                  </th>
                  <th scope="col" className="p-2 text-right font-medium">
                    Esperado (g)
                  </th>
                  <th scope="col" className="p-2 text-right font-medium">
                    Desvio
                  </th>
                </tr>
              </thead>
              <tbody>
                {points.map((p) => {
                  const low =
                    p.deviationPct !== null && p.deviationPct < GROWTH_DEVIATION_ALERT_PCT;
                  return (
                    <tr
                      key={`${p.batchName}-${p.date}-${p.day}`}
                      className="border-b border-border"
                    >
                      <td className="p-2">{p.batchName}</td>
                      <td className="p-2">{formatCalendarDatePtBR(p.date)}</td>
                      <td className="p-2 text-right tabular-nums">{fmtNumber(p.day)}</td>
                      <td className="p-2 text-right tabular-nums">{fmtNumber(p.actualG, 1)}</td>
                      <td className="p-2 text-right tabular-nums">{fmtNumber(p.expectedG, 1)}</td>
                      <td
                        className={cn(
                          'p-2 text-right tabular-nums',
                          low && 'font-semibold text-red-600',
                        )}
                      >
                        {p.deviationPct === null && p.expectedG === null ? (
                          <span title="Sem curva de referência">{EMPTY_VALUE}</span>
                        ) : (
                          fmtPct(p.deviationPct)
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {points.some((p) => p.expectedG === null) && (
            <p className="mt-2 text-xs text-slate-500">
              “—” no desvio indica espécie sem curva de referência ou dia fora da curva.
            </p>
          )}
        </>
      )}
    </ReportSection>
  );
}
