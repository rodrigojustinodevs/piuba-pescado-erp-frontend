'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTransfer } from '@/features/transfer';
import { useBatches } from '@/features/batch';
import { useTanks } from '@/features/tank';
import { DashboardLayout } from '@/shared/components/Layout';
import { demoUser } from '@/shared/constants/demoUser';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';
import { CircleIcon } from '@/shared/components/icons/AppIcons';
import { formatDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';

export default function TransferDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: transfer, isLoading, error } = useTransfer(id);
  const { data: batchesData } = useBatches({ page: 1, limit: 1000 });
  const { data: tanksData } = useTanks({ page: 1, limit: 1000 });

  const batchMap = useMemo(() => {
    const map: Record<string, string> = {};
    batchesData?.batches?.forEach((b) => {
      map[b.id] = b.name || b.species || b.id.slice(0, 8);
    });
    return map;
  }, [batchesData?.batches]);

  const tankMap = useMemo(() => {
    const map: Record<string, string> = {};
    tanksData?.tanks?.forEach((t) => {
      map[t.id] = t.name || t.id.slice(0, 8);
    });
    return map;
  }, [tanksData?.tanks]);

  if (isLoading) {
    return (
      <DashboardLayout user={demoUser}>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !transfer) {
    return (
      <DashboardLayout user={demoUser}>
        <NotFoundState message="Transferência não encontrada." backHref="/company/transfers" />
      </DashboardLayout>
    );
  }

  const batchLabel = batchMap[transfer.batcheId] ?? `${transfer.batcheId.slice(0, 8)}…`;
  const originTankLabel = tankMap[transfer.originTankId] ?? `${transfer.originTankId.slice(0, 8)}…`;
  const destinationTankLabel =
    tankMap[transfer.destinationTankId] ?? `${transfer.destinationTankId.slice(0, 8)}…`;

  return (
    <DashboardLayout user={demoUser}>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <p className="text-sm text-slate-600 mb-4">
          Dashboard / Transferências / {transfer.id ? `${transfer.id.slice(0, 8)}…` : '—'}
        </p>

        <div className="rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between mb-8 bg-white rounded-t-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0EA5A4]/10 border-2 border-[#0EA5A4]/20">
                <CircleIcon className="h-8 w-8 text-[#0EA5A4]" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Transferência</h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#0F172A]">Lote: {batchLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/company/transfers"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
              >
                Voltar
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
              <p className="text-sm text-slate-600 mb-2">Quantidade</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{transfer.quantity}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
              <p className="text-sm text-slate-600 mb-2">Tanque de origem</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{originTankLabel}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
              <p className="text-sm text-slate-600 mb-2">Tanque de destino</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{destinationTankLabel}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
              <p className="text-sm text-slate-600 mb-2">Criado em</p>
              <p className="text-2xl font-semibold text-[#0F172A]">
                {transfer.createdAt ? formatDatePtBR(transfer.createdAt) : '—'}
              </p>
            </div>
          </div>

          <div className="mb-8 mr-8 ml-8 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
              <h2 className="text-base font-semibold text-[#0F172A]">
                Informações da Transferência
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">LOTE</p>
                  <p className="text-sm font-medium text-[#0F172A]">{batchLabel}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">ORIGEM</p>
                    <p className="text-sm font-medium text-[#0F172A]">{originTankLabel}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">DESTINO</p>
                    <p className="text-sm font-medium text-[#0F172A]">{destinationTankLabel}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">DESCRIÇÃO</p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {transfer.description || '—'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">CRIAÇÃO</p>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {transfer.createdAt ? formatRelativeDateTimePtBR(transfer.createdAt) : '—'}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                      ÚLTIMA ATUALIZAÇÃO
                    </p>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {transfer.updatedAt ? formatRelativeDateTimePtBR(transfer.updatedAt) : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
