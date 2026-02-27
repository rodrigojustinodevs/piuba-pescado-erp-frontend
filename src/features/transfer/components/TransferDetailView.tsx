'use client';

import Link from 'next/link';
import type { Transfer } from '../types';
import { formatDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';
import { CircleIcon, PencilIcon } from '@/shared/components/icons/AppIcons';

const CARD_CLASS = 'bg-white rounded-2xl border border-slate-200 shadow-sm';
const SECTION_CLASS = 'bg-white p-8 rounded-xl border border-slate-200 shadow-sm';
const LABEL_CLASS = 'text-xs font-medium text-slate-600 uppercase mb-2';
const VALUE_CLASS = 'text-sm font-medium text-[#0F172A]';

function trunc8(id: string) {
  return `${id.slice(0, 8)}…`;
}

type InfoCardProps = {
  label: string;
  value: React.ReactNode;
};

function InfoCard({ label, value }: Readonly<InfoCardProps>) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <p className={LABEL_CLASS}>{label}</p>
      <p className={VALUE_CLASS}>{value}</p>
    </div>
  );
}

export type TransferDetailViewProps = {
  transfer: Transfer;
  batchLabel: string;
  originTankLabel: string;
  destinationTankLabel: string;
};

export function TransferDetailView({
  transfer,
  batchLabel,
  originTankLabel,
  destinationTankLabel,
}: Readonly<TransferDetailViewProps>) {
  const transferIdLabel = trunc8(transfer.id);

  return (
    <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
      <p className="text-sm text-slate-600 mb-4">Dashboard / Transferências / {transferIdLabel}</p>

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
            <Link
              href={`/company/transfers/${transfer.id}/edit`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
            >
              <PencilIcon className="h-4 w-4" />
              Editar
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
          <div className={`${CARD_CLASS} p-6 max-w-sm`}>
            <p className="text-sm text-slate-600 mb-2">Quantidade</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{transfer.quantity}</p>
          </div>
          <div className={`${CARD_CLASS} p-6 max-w-sm`}>
            <p className="text-sm text-slate-600 mb-2">Tanque de origem</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{originTankLabel}</p>
          </div>
          <div className={`${CARD_CLASS} p-6 max-w-sm`}>
            <p className="text-sm text-slate-600 mb-2">Tanque de destino</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{destinationTankLabel}</p>
          </div>
          <div className={`${CARD_CLASS} p-6 max-w-sm`}>
            <p className="text-sm text-slate-600 mb-2">Criado em</p>
            <p className="text-2xl font-semibold text-[#0F172A]">
              {transfer.createdAt ? formatDatePtBR(transfer.createdAt) : '—'}
            </p>
          </div>
        </div>

        <div className={`mb-8 mr-8 ml-8 ${SECTION_CLASS}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
            <h2 className="text-base font-semibold text-[#0F172A]">Informações da Transferência</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <InfoCard label="LOTE" value={batchLabel} />
              <div className="grid grid-cols-2 gap-4">
                <InfoCard label="ORIGEM" value={originTankLabel} />
                <InfoCard label="DESTINO" value={destinationTankLabel} />
              </div>
            </div>

            <div className="space-y-4">
              <InfoCard label="DESCRIÇÃO" value={transfer.description || '—'} />
              <div className="grid grid-cols-2 gap-4">
                <InfoCard
                  label="CRIAÇÃO"
                  value={transfer.createdAt ? formatRelativeDateTimePtBR(transfer.createdAt) : '—'}
                />
                <InfoCard
                  label="ÚLTIMA ATUALIZAÇÃO"
                  value={transfer.updatedAt ? formatRelativeDateTimePtBR(transfer.updatedAt) : '—'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
