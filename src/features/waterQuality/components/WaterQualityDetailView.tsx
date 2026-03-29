'use client';

import Link from 'next/link';
import type { WaterQuality } from '../types';
import { DetailInfoField, DetailSummaryCard } from '@/shared/components/entityDetail';
import { PencilIcon, SpinnerIcon, TrashIcon } from '@/shared/components/icons/AppIcons';
import { formatNullableDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';

export type WaterQualityDetailViewProps = {
  record: WaterQuality;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
};

export function WaterQualityDetailView({
  record,
  onDelete,
  isDeleting = false,
}: Readonly<WaterQualityDetailViewProps>) {
  const titleLabel = `${record.tankName || 'Tanque'} · pH ${record.ph}`;
  const measuredAt = formatNullableDatePtBR(record.measuredAt, true);

  const metricCards = [
    { label: 'pH', value: record.ph },
    { label: 'O₂ dissolvido', value: record.dissolvedOxygen },
    { label: 'Temperatura (°C)', value: record.temperature },
    { label: 'Amônia', value: record.ammonia },
  ];

  const infoItems = [
    { label: 'SALINIDADE', value: record.salinity || '—' },
    { label: 'TURBIDEZ', value: record.turbidity || '—' },
    { label: 'OBSERVAÇÕES', value: record.notes || '—' },
    { label: 'CRIADO EM', value: formatNullableDatePtBR(record.createdAt, true) },
    { label: 'ÚLTIMA ATUALIZAÇÃO', value: formatRelativeDateTimePtBR(record.updatedAt) },
  ];

  return (
    <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
      <p className="text-sm text-slate-600 mb-4">Dashboard / Qualidade da água / {titleLabel}</p>

      <div className="rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between mb-8 bg-white rounded-t-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0EA5A4]/10 border-2 border-[#0EA5A4]/20">
              <svg
                className="h-8 w-8 text-[#0EA5A4]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3c-4.5 5.5-8 9.5-8 13a8 8 0 1016 0c0-3.5-3.5-7.5-8-13z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">{titleLabel}</h1>
              <p className="text-sm text-slate-600">
                Tanque: {record.tankName || '—'} · Medição: {measuredAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(record.id, titleLabel)}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <SpinnerIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <TrashIcon className="h-4 w-4" />
                )}
                Excluir
              </button>
            ) : null}
            <Link
              href={`/company/water-qualities/${record.id}/edit`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
            >
              <PencilIcon className="h-4 w-4" />
              Editar
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
          {metricCards.map((card) => (
            <DetailSummaryCard key={card.label} label={card.label} value={card.value} />
          ))}
        </div>

        <div className="mb-8 mr-8 ml-8 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
            <h2 className="text-base font-semibold text-[#0F172A]">Detalhes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infoItems.map((item) => (
              <DetailInfoField key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
