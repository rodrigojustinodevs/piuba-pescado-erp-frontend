'use client';

import Link from 'next/link';
import type { Feeding } from '../types';
import { formatDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';
import { PencilIcon } from '@/shared/components/icons/AppIcons';

export type FeedingDetailViewProps = {
  feeding: Feeding;
};

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
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

function formatNumber(value: number): string {
  return Number.isFinite(value) ? String(value) : '—';
}

export function FeedingDetailView({ feeding }: Readonly<FeedingDetailViewProps>) {
  const titleLabel = feeding.batch.name || `Alimentação ${formatDateTime(feeding.feedingDate)}`;

  return (
    <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
      <p className="text-sm text-slate-600 mb-4">Dashboard / Alimentações / {titleLabel}</p>

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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">{titleLabel}</h1>
              <p className="text-sm text-slate-600">Data: {formatDateTime(feeding.feedingDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/company/feedings/${feeding.id}/edit`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
            >
              <PencilIcon className="h-4 w-4" />
              Editar
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Lote</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{feeding.batch.name || '—'}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Data da alimentação</p>
            <p className="text-2xl font-semibold text-[#0F172A]">
              {formatDateTime(feeding.feedingDate)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Quantidade fornecida</p>
            <p className="text-2xl font-semibold text-[#0F172A]">
              {formatNumber(feeding.quantityProvided)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Tipo de ração</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{feeding.feedType || '—'}</p>
          </div>
        </div>

        <div className="mb-8 mr-8 ml-8 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
            <h2 className="text-base font-semibold text-[#0F172A]">Informações da Alimentação</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs font-medium text-slate-600 uppercase mb-2">LOTE</p>
                <p className="text-sm font-medium text-[#0F172A]">{feeding.batch.name || '—'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                    DATA DA ALIMENTAÇÃO
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatDateTime(feeding.feedingDate)}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                    QTD. FORNECIDA
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatNumber(feeding.quantityProvided)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs font-medium text-slate-600 uppercase mb-2">TIPO DE RAÇÃO</p>
                <p className="text-sm font-medium text-[#0F172A]">{feeding.feedType || '—'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                    REDUÇÃO DE ESTOQUE
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatNumber(feeding.stockReductionQuantity)}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                    ÚLTIMA ATUALIZAÇÃO
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatRelativeDateTimePtBR(feeding.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
