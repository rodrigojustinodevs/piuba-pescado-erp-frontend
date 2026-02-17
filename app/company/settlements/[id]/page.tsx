'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSettlement } from '@/features/settlement';
import { useBatches } from '@/features/batch';
import { DashboardLayout } from '@/shared/components/Layout';
import { CircleIcon } from '@/shared/components/icons/AppIcons';
import { demoUser } from '@/shared/constants/demoUser';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';
import { formatDatePtBR } from '@/shared/utils/dateFormat';

const PAGE_BG_CLASS = '-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full';
const CARD_CLASS = 'bg-white rounded-2xl border border-slate-200 shadow-sm';
const SECTION_CLASS = 'bg-white p-8 rounded-xl border border-slate-200 shadow-sm';
const LABEL_CLASS = 'text-xs font-medium text-slate-600 uppercase mb-2';
const VALUE_CLASS = 'text-sm font-medium text-[#0F172A]';

function trunc8(id: string) {
  return `${id.slice(0, 8)}…`;
}

function formatNumberPtBR(value: number) {
  return value.toLocaleString('pt-BR');
}

type MetricCardProps = {
  label: string;
  value: React.ReactNode;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className={`${CARD_CLASS} p-6 max-w-sm`}>
      <p className="text-sm text-slate-600 mb-2">{label}</p>
      <p className="text-2xl font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}

type InfoCardProps = {
  label: string;
  value: React.ReactNode;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <p className={LABEL_CLASS}>{label}</p>
      <p className={VALUE_CLASS}>{value}</p>
    </div>
  );
}

export default function SettlementDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: settlement, isLoading, error } = useSettlement(id);
  const { data: batchesData } = useBatches({ page: 1, limit: 1000 });

  const settlementIdLabel = useMemo(() => (settlement ? trunc8(settlement.id) : '—'), [settlement]);

  const batchLabel = useMemo(() => {
    if (!settlement) return '—';
    const batch = batchesData?.batches?.find((b) => b.id === settlement.batcheId);
    if (batch) {
      const entry = batch.entryDate?.split('T')[0] ?? '-';
      return `${batch.species} (${entry})`;
    }
    return trunc8(settlement.batcheId);
  }, [batchesData?.batches, settlement]);

  const totalWeightKg = useMemo(() => {
    if (!settlement) return 0;
    return settlement.quantity * settlement.averageWeight;
  }, [settlement]);

  if (isLoading) {
    return (
      <DashboardLayout user={demoUser}>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !settlement) {
    return (
      <DashboardLayout user={demoUser}>
        <NotFoundState message="Povoamento não encontrado." backHref="/company/settlements" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={demoUser}>
      <div className={PAGE_BG_CLASS}>
        {/* Breadcrumb */}
        <p className="text-sm text-slate-600 mb-4">Dashboard / Povoamentos / {settlementIdLabel}</p>

        <div className="rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between mb-8 bg-white rounded-t-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0EA5A4]/10 border-2 border-[#0EA5A4]/20">
                <CircleIcon className="h-8 w-8 text-[#0EA5A4]" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">
                  Povoamento {settlementIdLabel}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#0F172A]">Lote: {batchLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/company/settlements/${settlement.id}/edit`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
            <MetricCard
              label="Data do Povoamento"
              value={formatDatePtBR(settlement.settlementDate)}
            />
            <MetricCard label="Quantidade" value={settlement.quantity} />
            <MetricCard
              label="Peso médio (kg)"
              value={formatNumberPtBR(settlement.averageWeight)}
            />
            <MetricCard label="Peso total (kg)" value={formatNumberPtBR(totalWeightKg)} />
          </div>

          <div className={`mb-8 mr-8 ml-8 ${SECTION_CLASS}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
              <h2 className="text-base font-semibold text-[#0F172A]">Informações do Povoamento</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <InfoCard label="LOTE" value={batchLabel} />
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard
                    label="DATA DO POVOAMENTO"
                    value={formatDatePtBR(settlement.settlementDate)}
                  />
                  <InfoCard label="QUANTIDADE" value={settlement.quantity} />
                </div>
              </div>

              <div className="space-y-4">
                <InfoCard
                  label="PESO MÉDIO (KG)"
                  value={formatNumberPtBR(settlement.averageWeight)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard label="PESO TOTAL (KG)" value={formatNumberPtBR(totalWeightKg)} />
                  <InfoCard label="CRIADO EM" value={formatDatePtBR(settlement.createdAt)} />
                </div>
              </div>
            </div>
          </div>

          <div className={`m-8 ${SECTION_CLASS}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
              <h2 className="text-base font-semibold text-[#0F172A]">Informações Adicionais</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="DATA DE CRIAÇÃO" value={formatDatePtBR(settlement.createdAt)} />
              <InfoCard label="ÚLTIMA ATUALIZAÇÃO" value={formatDatePtBR(settlement.updatedAt)} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
