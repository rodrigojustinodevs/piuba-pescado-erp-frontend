'use client';

import Link from 'next/link';
import type { SensorReading } from '../types';
import { getSensorTypeLabel } from '@/features/sensor/utils/sensorDisplayLabels';
import { PencilIcon, SpinnerIcon, TrashIcon } from '@/shared/components/icons/AppIcons';
import { formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';

export type SensorReadingDetailViewProps = {
  reading: SensorReading;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
};

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

function formatValue(value: number, unit: string): string {
  if (!Number.isFinite(value)) return '—';
  const u = unit?.trim() ? ` ${unit}` : '';
  return `${value}${u}`;
}

export function SensorReadingDetailView({
  reading,
  onDelete,
  isDeleting = false,
}: Readonly<SensorReadingDetailViewProps>) {
  const typeLabel = getSensorTypeLabel(reading.sensorType);
  const titleLabel = `${formatValue(reading.value, reading.unit)} — ${reading.tankName || 'Tanque'}`;

  return (
    <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
      <p className="text-sm text-slate-600 mb-4">Dashboard / Leituras / {titleLabel}</p>

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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">{titleLabel}</h1>
              <p className="text-sm text-slate-600">
                Sensor: {typeLabel} · Medição: {formatDateTime(reading.measuredAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(reading.id, titleLabel)}
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
              href={`/company/sensor-readings/${reading.id}/edit`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
            >
              <PencilIcon className="h-4 w-4" />
              Editar
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Valor</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{formatValue(reading.value, reading.unit)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Tanque</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{reading.tankName || '—'}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Data da medição</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{formatDateTime(reading.measuredAt)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Atualizado em</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{formatDateTime(reading.updatedAt)}</p>
          </div>
        </div>

        <div className="mb-8 mr-8 ml-8 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
            <h2 className="text-base font-semibold text-[#0F172A]">Detalhes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs font-medium text-slate-600 uppercase mb-2">OBSERVAÇÕES</p>
              <p className="text-sm font-medium text-[#0F172A]">{reading.notes || '—'}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs font-medium text-slate-600 uppercase mb-2">CRIADO EM</p>
              <p className="text-sm font-medium text-[#0F172A]">{formatDateTime(reading.createdAt)}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs font-medium text-slate-600 uppercase mb-2">ÚLTIMA ATUALIZAÇÃO</p>
              <p className="text-sm font-medium text-[#0F172A]">
                {formatRelativeDateTimePtBR(reading.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
