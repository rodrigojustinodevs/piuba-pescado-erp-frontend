import { CAUSE_LABELS, SEVERITY_LABELS } from '../constants';
import type { BatchRow, Mortality } from '../types';
import { fmtNumber, fmtPct } from '../utils/format';
import { ReportSection, SectionEmpty } from './ReportSection';
import { cn } from '@/shared/lib/utils';

function cellStyle(value: number, max: number): React.CSSProperties | undefined {
  if (value <= 0 || max <= 0) return undefined;
  const alpha = 0.12 + 0.55 * (value / max);
  return { backgroundColor: `rgba(220, 38, 38, ${alpha.toFixed(2)})` };
}

export function MortalitySection({
  mortality,
  batches,
}: Readonly<{ mortality: Mortality; batches: BatchRow[] }>) {
  const above = batches.filter((b) => b.aboveMortalityLimit);
  const max = Math.max(
    0,
    ...mortality.causes.flatMap((c) =>
      mortality.severities.map((s) => mortality.matrix[c]?.[s] ?? 0),
    ),
  );

  return (
    <ReportSection title="Mortalidade" description="Causa × gravidade no período selecionado.">
      {mortality.total === 0 ? (
        <SectionEmpty>Nenhuma mortalidade registrada no período.</SectionEmpty>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Mortes por causa e gravidade</caption>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th scope="col" className="p-2 font-medium">
                  Causa
                </th>
                {mortality.severities.map((s) => (
                  <th key={s} scope="col" className="p-2 text-right font-medium">
                    {SEVERITY_LABELS[s] ?? s}
                  </th>
                ))}
                <th scope="col" className="p-2 text-right font-medium">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {mortality.causes.map((cause) => (
                <tr key={cause} className="border-b border-border">
                  <th scope="row" className="p-2 text-left font-medium">
                    {CAUSE_LABELS[cause] ?? cause}
                  </th>
                  {mortality.severities.map((s) => {
                    const value = mortality.matrix[cause]?.[s] ?? 0;
                    return (
                      <td
                        key={s}
                        className="p-2 text-right tabular-nums"
                        style={cellStyle(value, max)}
                      >
                        {fmtNumber(value)}
                      </td>
                    );
                  })}
                  <td className="p-2 text-right font-semibold tabular-nums">
                    {fmtNumber(mortality.causeTotals[cause] ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <th scope="row" className="p-2 text-left">
                  Total
                </th>
                {mortality.severities.map((s) => (
                  <td key={s} className="p-2 text-right tabular-nums">
                    {fmtNumber(mortality.severityTotals[s] ?? 0)}
                  </td>
                ))}
                <td className="p-2 text-right tabular-nums">{fmtNumber(mortality.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className={cn('mt-4', above.length === 0 && 'hidden')}>
        <h3 className="text-sm font-semibold text-red-700">Lotes acima do limite de mortalidade</h3>
        <ul className="mt-1 space-y-0.5 text-sm text-slate-700">
          {above.map((b) => (
            <li key={b.batchId}>
              {b.batchName} ({b.tankName}) —{' '}
              <span className="font-medium text-red-600">{fmtPct(b.deathsPct)}</span>
            </li>
          ))}
        </ul>
      </div>
    </ReportSection>
  );
}
