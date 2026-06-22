'use client';

import type { Harvest, HarvestStatus, HarvestType } from '../types';
import { HARVEST_DESTINATION_LABELS, HARVEST_STATUS_LABELS, HARVEST_TYPE_LABELS } from '../types';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Calendar, Package, User } from 'lucide-react';
import { Badge } from '@/src/shared/components/ui/Badge';

type Props = { harvest: Harvest | null };

const STATUS_BADGE: Record<HarvestStatus, string> = {
  scheduled: 'bg-sky-500/15 text-sky-700 border-sky-500/30',
  completed: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  cancelled: 'bg-destructive/15 text-destructive border-destructive/40',
};

const TYPE_BADGE: Record<HarvestType, string> = {
  total: 'bg-primary/15 text-primary border-primary/30',
  partial: 'bg-muted text-foreground border-border',
  selective: 'bg-violet-500/15 text-violet-700 border-violet-500/30',
  emergency: 'bg-orange-500/15 text-orange-700 border-orange-500/30',
};

const fmt = (n: number, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat('pt-BR', opts).format(n);
const fmtCurrency = (n: number) => fmt(n, { style: 'currency', currency: 'BRL' });
const fmtPct = (n: number) => fmt(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';

export function HarvestViewDialogContent({ harvest }: Readonly<Props>) {
  if (!harvest) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Despesca não encontrada para visualização.
      </div>
    );
  }

  const biomassKg =
    harvest.sizeClassifications.length > 0
      ? harvest.sizeClassifications.reduce(
          (acc, c) => acc + (c.quantity * c.averageWeight) / 1000,
          0,
        )
      : (harvest.harvestedQuantity * harvest.averageWeight) / 1000;

  const grossRevenue = harvest.sizeClassifications.reduce(
    (acc, c) => acc + ((c.quantity * c.averageWeight) / 1000) * c.pricePerKg,
    0,
  );
  const netProfit = grossRevenue - (harvest.operationalCost ?? 0);
  const survivalRate =
    (harvest.initialPopulation ?? 0) > 0
      ? Math.min(100, (harvest.harvestedQuantity / harvest.initialPopulation!) * 100)
      : 0;

  return (
    <div className="space-y-5">
      {/* Badges row: status, type, destination, date */}
      <div className="flex flex-wrap items-center gap-2">
        {harvest.status && (
          <Badge variant="outline" className={STATUS_BADGE[harvest.status]}>
            {HARVEST_STATUS_LABELS[harvest.status]}
          </Badge>
        )}
        {harvest.type && (
          <Badge variant="outline" className={TYPE_BADGE[harvest.type]}>
            {HARVEST_TYPE_LABELS[harvest.type]}
          </Badge>
        )}
        {harvest.destination && (
          <Badge variant="outline" className="gap-1 text-slate-600 border-slate-300 bg-slate-50">
            <Package className="h-3 w-3" />
            {HARVEST_DESTINATION_LABELS[harvest.destination]}
          </Badge>
        )}
        <Badge variant="outline" className="gap-1 text-slate-600 border-slate-300 bg-slate-50">
          <Calendar className="h-3 w-3" />
          {formatNullableDatePtBR(harvest.harvestDate, false)}
        </Badge>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <SummaryMetric
          label="Biomassa"
          value={`${fmt(biomassKg, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`}
        />
        <SummaryMetric label="Receita bruta" value={fmtCurrency(grossRevenue)} />
        <SummaryMetric
          label="Lucro líquido"
          value={fmtCurrency(netProfit)}
          valueClass={netProfit >= 0 ? 'text-emerald-600' : 'text-destructive'}
        />
        <SummaryMetric label="Sobrevivência" value={fmtPct(survivalRate)} />
      </div>

      {/* Lote + Tanque | Cliente + Responsável */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        <InfoField label="Lote" value={harvest.batchName ?? harvest.batchId.slice(0, 8)} />
        <InfoField label="Tanque" value={harvest.tankName ?? '—'} />
        {harvest.clientDestination && (
          <InfoField label="Cliente / Destino" value={harvest.clientDestination} />
        )}
        {harvest.responsible && (
          <InfoField
            label="Responsável"
            value={harvest.responsible}
            icon={<User className="h-3.5 w-3.5 text-muted-foreground" />}
          />
        )}
      </div>

      <div className="border-t border-slate-100" />

      {/* Pop. inicial | Qtd. despescada | Peso médio | Custo operacional */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3">
        <InfoField label="População inicial" value={fmt(harvest.initialPopulation ?? 0)} />
        <InfoField label="Qtd. despescada" value={fmt(harvest.harvestedQuantity)} />
        <InfoField
          label="Peso médio"
          value={`${fmt(harvest.averageWeight, { minimumFractionDigits: 1 })} g`}
        />
        <InfoField label="Custo operacional" value={fmtCurrency(harvest.operationalCost ?? 0)} />
      </div>

      {/* Size classifications table */}
      {harvest.sizeClassifications.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">Classificação por tamanho</p>
          <div className="rounded-xl border border-slate-200 overflow-hidden text-sm">
            <div className="grid grid-cols-6 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 border-b border-slate-200">
              <div>Classe</div>
              <div className="text-right">Quantidade</div>
              <div className="text-right">Peso médio (g)</div>
              <div className="text-right">R$/kg</div>
              <div className="text-right">Biomassa (kg)</div>
              <div className="text-right">Receita</div>
            </div>
            {harvest.sizeClassifications.map((c, i) => {
              const rowBiomass = (c.quantity * c.averageWeight) / 1000;
              const rowRevenue = rowBiomass * c.pricePerKg;
              return (
                <div
                  key={c.class || i}
                  className="grid grid-cols-6 px-3 py-2.5 border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  <div className="font-semibold">{c.class}</div>
                  <div className="text-right text-slate-600">{fmt(c.quantity)}</div>
                  <div className="text-right text-slate-600">
                    {fmt(c.averageWeight, { minimumFractionDigits: 1 })}
                  </div>
                  <div className="text-right text-slate-600">{fmtCurrency(c.pricePerKg)}</div>
                  <div className="text-right text-slate-600">
                    {fmt(rowBiomass, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </div>
                  <div className="text-right font-medium text-emerald-700">
                    {fmtCurrency(rowRevenue)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Observações */}
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-slate-700">Observações</p>
        <div className="min-h-15 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600">
          {harvest.notes || <span className="text-slate-400">Nenhuma observação registrada.</span>}
        </div>
      </div>

      {/* Footer timestamps */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-slate-100">
        <span>Criado em: {formatNullableDatePtBR(harvest.createdAt, true)}</span>
        <span>Atualizado em: {formatNullableDatePtBR(harvest.updatedAt, true)}</span>
      </div>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  valueClass = '',
}: Readonly<{
  label: string;
  value: string;
  valueClass?: string;
}>) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className={`text-base font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function InfoField({
  label,
  value,
  icon,
}: Readonly<{
  label: string;
  value: string;
  icon?: React.ReactNode;
}>) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
        {icon}
        {value}
      </p>
    </div>
  );
}
