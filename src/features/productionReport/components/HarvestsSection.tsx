'use client';

import { Fragment, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { formatCalendarDatePtBR } from '@/shared/utils/dateFormat';
import { HARVEST_DESTINATION_LABELS, HARVEST_TYPE_LABELS } from '../constants';
import type { Harvest } from '../types';
import { EMPTY_VALUE, fmtKg, fmtMoney, fmtNumber } from '@/features/reportExport/format';
import { ReportSection, SectionEmpty } from '@/features/reportExport/ReportSection';

export function HarvestsSection({ harvests }: Readonly<{ harvests: Harvest[] }>) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <ReportSection title="Despescas" description="Despescas realizadas no período.">
      {harvests.length === 0 ? (
        <SectionEmpty>Nenhuma despesca no período.</SectionEmpty>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Despescas e suas classificações</caption>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th scope="col" className="w-8 p-2">
                  <span className="sr-only">Detalhes</span>
                </th>
                <th scope="col" className="p-2 font-medium">
                  Lote
                </th>
                <th scope="col" className="p-2 font-medium">
                  Data
                </th>
                <th scope="col" className="p-2 font-medium">
                  Tipo
                </th>
                <th scope="col" className="p-2 font-medium">
                  Destino
                </th>
                <th scope="col" className="p-2 text-right font-medium">
                  Qtd.
                </th>
                <th scope="col" className="p-2 text-right font-medium">
                  Peso médio (g)
                </th>
                <th scope="col" className="p-2 text-right font-medium">
                  Peso total
                </th>
                <th scope="col" className="p-2 text-right font-medium">
                  Preço/kg
                </th>
                <th scope="col" className="p-2 text-right font-medium">
                  Receita
                </th>
                <th scope="col" className="p-2 text-right font-medium">
                  Custo oper.
                </th>
              </tr>
            </thead>
            <tbody>
              {harvests.map((h) => {
                const open = expanded.has(h.id);
                const hasClasses = h.classifications.length > 0;
                return (
                  <Fragment key={h.id}>
                    <tr className="border-b border-border">
                      <td className="p-2">
                        {hasClasses && (
                          <button
                            type="button"
                            onClick={() => toggle(h.id)}
                            aria-expanded={open}
                            aria-label={`${open ? 'Recolher' : 'Expandir'} classificações da despesca de ${h.batch_name}`}
                            className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4]"
                          >
                            <ChevronRight
                              className={cn('h-4 w-4 transition-transform', open && 'rotate-90')}
                              aria-hidden="true"
                            />
                          </button>
                        )}
                      </td>
                      <td className="p-2">{h.batch_name}</td>
                      <td className="p-2">{formatCalendarDatePtBR(h.harvest_date)}</td>
                      <td className="p-2">{HARVEST_TYPE_LABELS[h.type] ?? h.type}</td>
                      <td className="p-2">
                        {h.destination
                          ? (HARVEST_DESTINATION_LABELS[h.destination] ?? h.destination)
                          : EMPTY_VALUE}
                      </td>
                      <td className="p-2 text-right tabular-nums">
                        {fmtNumber(h.harvested_quantity)}
                      </td>
                      <td className="p-2 text-right tabular-nums">
                        {fmtNumber(h.average_weight, 1)}
                      </td>
                      <td className="p-2 text-right tabular-nums">{fmtKg(h.total_weight)}</td>
                      <td className="p-2 text-right tabular-nums">{fmtMoney(h.price_per_kg)}</td>
                      <td className="p-2 text-right tabular-nums">{fmtMoney(h.total_revenue)}</td>
                      <td className="p-2 text-right tabular-nums">
                        {fmtMoney(h.operational_cost)}
                      </td>
                    </tr>
                    {open && (
                      <tr className="border-b border-border bg-slate-50">
                        <td />
                        <td colSpan={10} className="p-2">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-left text-muted-foreground">
                                <th scope="col" className="p-1 font-medium">
                                  Classe
                                </th>
                                <th scope="col" className="p-1 text-right font-medium">
                                  Quantidade
                                </th>
                                <th scope="col" className="p-1 text-right font-medium">
                                  Peso médio (g)
                                </th>
                                <th scope="col" className="p-1 text-right font-medium">
                                  Preço/kg
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {h.classifications.map((c) => (
                                <tr key={c.class}>
                                  <td className="p-1">{c.class}</td>
                                  <td className="p-1 text-right tabular-nums">
                                    {fmtNumber(c.quantity)}
                                  </td>
                                  <td className="p-1 text-right tabular-nums">
                                    {fmtNumber(c.average_weight, 1)}
                                  </td>
                                  <td className="p-1 text-right tabular-nums">
                                    {fmtMoney(c.price_per_kg)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ReportSection>
  );
}
