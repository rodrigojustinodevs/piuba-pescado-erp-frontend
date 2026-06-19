'use client';

import type { Biometry } from '../types';
import { formatDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';
import { formatNumber, formatSampleWeight, formatSampleQuantity } from '../utils/formatters';

export type BiometryDetailViewProps = {
  biometry: Biometry;
};

export function BiometryDetailView({ biometry }: Readonly<BiometryDetailViewProps>) {
  const titleLabel = biometry.batchName || `Biometria ${biometry.biometryDate}`;

  return (
    <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
      <p className="text-sm text-slate-600 mb-4">Dashboard / Biometrias / {titleLabel}</p>

      <div className="rounded-2xl border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="flex items-start mb-8 bg-white rounded-t-2xl border border-slate-200 shadow-sm p-8">
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
                Data da biometria: {formatDatePtBR(biometry.biometryDate)}
              </p>
            </div>
          </div>

        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 p-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Lote</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{biometry.batchName || '—'}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Data da biometria</p>
            <p className="text-2xl font-semibold text-[#0F172A]">
              {formatDatePtBR(biometry.biometryDate)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Peso médio</p>
            <p className="text-2xl font-semibold text-[#0F172A]">
              {formatNumber(biometry.averageWeight)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Peso da amostra</p>
            <p className="text-2xl font-semibold text-[#0F172A]">
              {formatSampleWeight(biometry.sampleWeight)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Qtd. na amostra</p>
            <p className="text-2xl font-semibold text-[#0F172A]">
              {formatSampleQuantity(biometry.sampleQuantity)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">FCR</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{formatNumber(biometry.fcr)}</p>
          </div>
        </div>

        {/* Informações da Biometria */}
        <div className="mb-8 mr-8 ml-8 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
            <h2 className="text-base font-semibold text-[#0F172A]">Informações da Biometria</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs font-medium text-slate-600 uppercase mb-2">LOTE</p>
                <p className="text-sm font-medium text-[#0F172A]">{biometry.batchName || '—'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                    DATA DA BIOMETRIA
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatDatePtBR(biometry.biometryDate)}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">PESO MÉDIO</p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatNumber(biometry.averageWeight)}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">PESO DA AMOSTRA</p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatSampleWeight(biometry.sampleWeight)}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">QTD. AMOSTRA</p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatSampleQuantity(biometry.sampleQuantity)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs font-medium text-slate-600 uppercase mb-2">FCR</p>
                <p className="text-sm font-medium text-[#0F172A]">{formatNumber(biometry.fcr)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                    DATA DE CRIAÇÃO
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatDatePtBR(biometry.createdAt)}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                    ÚLTIMA ATUALIZAÇÃO
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatRelativeDateTimePtBR(biometry.updatedAt)}
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
