'use client';

import Link from 'next/link';
import type { Harvest } from '../types';
import {
  HARVEST_DESTINATION_LABELS,
  HARVEST_STATUS_LABELS,
  HARVEST_TYPE_LABELS,
} from '../types';
import { formatDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';
import { CircleIcon, PencilIcon } from '@/shared/components/icons/AppIcons';

const CARD_CLASS = 'bg-white rounded-2xl border border-slate-200 shadow-sm';
const SECTION_CLASS = 'bg-white p-8 rounded-xl border border-slate-200 shadow-sm';
const LABEL_CLASS = 'text-xs font-medium text-slate-600 uppercase mb-2';
const VALUE_CLASS = 'text-sm font-medium text-[#0F172A]';

function trunc8(id: string) {
  return `${id.slice(0, 8)}…`;
}

const fmt = (n: number, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat('pt-BR', opts).format(n);
const fmtCurrency = (n: number) => fmt(n, { style: 'currency', currency: 'BRL' });

type InfoCardProps = { label: string; value: React.ReactNode };

function InfoCard({ label, value }: Readonly<InfoCardProps>) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <p className={LABEL_CLASS}>{label}</p>
      <p className={VALUE_CLASS}>{value}</p>
    </div>
  );
}

export type HarvestDetailViewProps = {
  harvest: Harvest;
  batchLabel: string;
};

export function HarvestDetailView({ harvest, batchLabel }: Readonly<HarvestDetailViewProps>) {
  const harvestIdLabel = trunc8(harvest.id);

  const biomassKg = (harvest.harvestedQuantity * harvest.averageWeight) / 1000;
  const grossRevenue = (harvest.sizeClassifications ?? []).reduce(
    (acc, c) => acc + ((c.quantity * c.averageWeight) / 1000) * c.pricePerKg,
    0,
  );
  const netProfit = grossRevenue - (harvest.operationalCost ?? 0);

  return (
    <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
      <p className="text-sm text-slate-600 mb-4">Dashboard / Despescas / {harvestIdLabel}</p>

      <div className="rounded-2xl border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 bg-white rounded-t-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0EA5A4]/10 border-2 border-[#0EA5A4]/20">
              <CircleIcon className="h-8 w-8 text-[#0EA5A4]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Despesca</h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#0F172A]">Lote: {batchLabel}</span>
                {harvest.status && (
                  <span className="text-sm text-slate-500">
                    · {HARVEST_STATUS_LABELS[harvest.status]}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/company/disposals"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
            >
              Voltar
            </Link>
            <Link
              href={`/company/disposals/${harvest.id}/edit`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
            >
              <PencilIcon className="h-4 w-4" />
              Editar
            </Link>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
          <div className={`${CARD_CLASS} p-6`}>
            <p className="text-sm text-slate-600 mb-2">Biomassa despescada</p>
            <p className="text-2xl font-semibold text-[#0F172A]">
              {fmt(biomassKg, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
            </p>
          </div>
          <div className={`${CARD_CLASS} p-6`}>
            <p className="text-sm text-slate-600 mb-2">Receita bruta</p>
            <p className="text-2xl font-semibold text-emerald-700">{fmtCurrency(grossRevenue)}</p>
          </div>
          <div className={`${CARD_CLASS} p-6`}>
            <p className="text-sm text-slate-600 mb-2">Lucro líquido</p>
            <p
              className={`text-2xl font-semibold ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}
            >
              {fmtCurrency(netProfit)}
            </p>
          </div>
          <div className={`${CARD_CLASS} p-6`}>
            <p className="text-sm text-slate-600 mb-2">Data da despesca</p>
            <p className="text-2xl font-semibold text-[#0F172A]">
              {formatDatePtBR(harvest.harvestDate)}
            </p>
          </div>
        </div>

        {/* Detail section */}
        <div className={`mb-8 mr-8 ml-8 ${SECTION_CLASS}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
            <h2 className="text-base font-semibold text-[#0F172A]">Informações da Despesca</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-4">
              <InfoCard label="LOTE" value={batchLabel} />
              <InfoCard label="TANQUE" value={harvest.tankName ?? '—'} />
              <div className="grid grid-cols-2 gap-4">
                <InfoCard
                  label="TIPO"
                  value={harvest.type ? HARVEST_TYPE_LABELS[harvest.type] : '—'}
                />
                <InfoCard
                  label="DESTINO COMERCIAL"
                  value={harvest.destination ? HARVEST_DESTINATION_LABELS[harvest.destination] : '—'}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <InfoCard label="POP. INICIAL" value={fmt(harvest.initialPopulation ?? 0)} />
                <InfoCard label="QTD. DESPESCADA" value={fmt(harvest.harvestedQuantity)} />
                <InfoCard
                  label="PESO MÉDIO (G)"
                  value={fmt(harvest.averageWeight, { minimumFractionDigits: 1 })}
                />
              </div>
              {harvest.clientDestination && (
                <InfoCard label="CLIENTE / DESTINO" value={harvest.clientDestination} />
              )}
              {harvest.responsible && (
                <InfoCard label="RESPONSÁVEL" value={harvest.responsible} />
              )}
              {harvest.operationalCost !== undefined && (
                <InfoCard label="CUSTO OPERACIONAL" value={fmtCurrency(harvest.operationalCost)} />
              )}
            </div>
          </div>

          {/* Size classifications table */}
          {harvest.sizeClassifications && harvest.sizeClassifications.length > 0 && (
            <div className="mt-2 rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <p className="text-sm font-semibold text-[#0F172A]">Classificação por tamanho</p>
              </div>
              <div className="grid grid-cols-4 px-4 py-2 bg-slate-50 text-xs font-medium text-slate-500 uppercase border-b border-slate-100">
                <div>Classe</div>
                <div className="text-right">Quantidade</div>
                <div className="text-right">Peso médio (g)</div>
                <div className="text-right">R$/kg</div>
              </div>
              {harvest.sizeClassifications.map((c, i) => (
                <div key={c.class || i} className="grid grid-cols-4 px-4 py-2.5 border-b border-slate-100 last:border-0">
                  <div className="text-sm font-medium text-[#0F172A]">{c.class}</div>
                  <div className="text-sm text-right text-slate-600">{fmt(c.quantity)}</div>
                  <div className="text-sm text-right text-slate-600">
                    {fmt(c.averageWeight, { minimumFractionDigits: 1 })}
                  </div>
                  <div className="text-sm text-right text-slate-600">{fmtCurrency(c.pricePerKg)}</div>
                </div>
              ))}
            </div>
          )}

          {harvest.notes && (
            <div className="mt-4 rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase mb-1">Observações</p>
              <p className="text-sm text-slate-700">{harvest.notes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4">
            <InfoCard
              label="CRIAÇÃO"
              value={harvest.createdAt ? formatRelativeDateTimePtBR(harvest.createdAt) : '—'}
            />
            <InfoCard
              label="ÚLTIMA ATUALIZAÇÃO"
              value={harvest.updatedAt ? formatRelativeDateTimePtBR(harvest.updatedAt) : '—'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
