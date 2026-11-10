'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/shared/lib/utils';
import { formatCalendarDatePtBR } from '@/shared/utils/dateFormat';
import type { WeeklyFeeding } from '../types';
import { fmtPct } from '@/features/reportExport/format';
import { useReportFormatters } from '@/features/reportExport/useReportFormatters';
import { ReportSection, SectionEmpty } from '@/features/reportExport/ReportSection';

const PAGE_SIZE = 50;

export function WeeklyFeedingSection({ rows }: Readonly<{ rows: WeeklyFeeding[] }>) {
  const { fmtKg } = useReportFormatters();
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const visible = rows.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);
  const aboveCount = rows.filter((r) => r.aboveMax).length;

  return (
    <ReportSection
      title="Alimentação semanal"
      description="% da biomassa por dia calculado sobre a biomassa na data de corte."
    >
      {rows.length === 0 ? (
        <SectionEmpty>Nenhuma alimentação no período.</SectionEmpty>
      ) : (
        <>
          {aboveCount > 0 && (
            <p className="mb-3 text-sm font-medium text-red-700">
              {aboveCount} {aboveCount === 1 ? 'semana acima' : 'semanas acima'} do teto da espécie.
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Ração por lote e semana</caption>
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th scope="col" className="p-2 font-medium">
                    Lote
                  </th>
                  <th scope="col" className="p-2 font-medium">
                    Semana (segunda)
                  </th>
                  <th scope="col" className="p-2 text-right font-medium">
                    Ração
                  </th>
                  <th scope="col" className="p-2 text-right font-medium">
                    % biomassa/dia
                  </th>
                  <th scope="col" className="p-2 text-right font-medium">
                    Teto
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr
                    key={`${r.batchName}-${r.weekStart}`}
                    className={cn('border-b border-border', r.aboveMax && 'bg-red-50')}
                  >
                    <td className="p-2">{r.batchName}</td>
                    <td className="p-2">{formatCalendarDatePtBR(r.weekStart)}</td>
                    <td className="p-2 text-right tabular-nums">{fmtKg(r.kg)}</td>
                    <td
                      className={cn(
                        'p-2 text-right tabular-nums',
                        r.aboveMax && 'font-semibold text-red-600',
                      )}
                    >
                      {fmtPct(r.avgDailyPctBiomass, 2)}
                    </td>
                    <td className="p-2 text-right tabular-nums">{fmtPct(r.maxPct, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pageCount > 1 && (
            <nav
              aria-label="Paginação da alimentação semanal"
              className="mt-3 flex items-center justify-between text-sm text-slate-600"
            >
              <span>
                Página {current + 1} de {pageCount} · {rows.length} linhas
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={current === 0}
                  onClick={() => setPage(current - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={current >= pageCount - 1}
                  onClick={() => setPage(current + 1)}
                >
                  Próxima
                </Button>
              </div>
            </nav>
          )}
        </>
      )}
    </ReportSection>
  );
}
