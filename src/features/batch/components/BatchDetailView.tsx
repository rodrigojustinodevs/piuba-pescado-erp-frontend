'use client';

import Link from 'next/link';
import type { Batch } from '../types';
import { BatchStatusBadge } from './BatchStatusBadge';
import {
  formatDate,
  formatQuantity,
  getCultivationLabel,
  formatDateTime,
  formatBatchShortLabel,
} from '../utils/format';
import { PencilIcon } from '@/shared/components/icons/AppIcons';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { ManagementPlanSection, MANAGEMENT_PLAN_VIEW_ROLES } from '@/features/managementPlan';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/Tabs';

export type BatchDetailViewProps = {
  batch: Batch;
};

export function BatchDetailView({ batch }: Readonly<BatchDetailViewProps>) {
  const titleLabel = formatBatchShortLabel(batch);
  const { canAccess } = useAuthContext();
  const canViewManagementPlan = canAccess(MANAGEMENT_PLAN_VIEW_ROLES);

  return (
    <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
      <p className="text-sm text-slate-600 mb-4">Dashboard / Lotes / {titleLabel}</p>

      <div className="rounded-2xl border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 bg-white rounded-t-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0EA5A4]/10 border-2 border-[#0EA5A4]/20">
              <svg
                className="h-8 w-8 text-[#0EA5A4]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">{titleLabel}</h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#0F172A]">Tanque: {batch.tank?.name ?? '—'}</span>
                <BatchStatusBadge status={batch.status} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/company/batches/${batch.id}/edit`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
            >
              <PencilIcon className="h-4 w-4" />
              Editar
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Quantidade Inicial</p>
            <p className="text-2xl font-semibold text-[#0F172A]">
              {formatQuantity(batch.initialQuantity)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Espécie</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{batch.species}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Tipo de Cultivo</p>
            <p className="text-2xl font-semibold text-[#0F172A]">
              {getCultivationLabel(batch.cultivation)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
            <p className="text-sm text-slate-600 mb-2">Data de Entrada</p>
            <p className="text-2xl font-semibold text-[#0F172A]">{formatDate(batch.entryDate)}</p>
          </div>
        </div>

        <Tabs defaultValue="detalhes" className="mx-8 mb-8">
          <TabsList>
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            {canViewManagementPlan && (
              <TabsTrigger value="plano-manejo">Plano de Manejo (IA)</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="detalhes">
        {/* Informações do Lote */}
        <div className="mb-8 mt-6 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
            <h2 className="text-base font-semibold text-[#0F172A]">Informações do Lote</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs font-medium text-slate-600 uppercase mb-2">TANQUE</p>
                <p className="text-sm font-medium text-[#0F172A]">{batch.tank?.name ?? '—'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">ESPÉCIE</p>
                  <p className="text-sm font-medium text-[#0F172A]">{batch.species}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                    QUANTIDADE INICIAL
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatQuantity(batch.initialQuantity)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs font-medium text-slate-600 uppercase mb-2">TIPO DE CULTIVO</p>
                <p className="text-sm font-medium text-[#0F172A]">
                  {getCultivationLabel(batch.cultivation)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">STATUS</p>
                  <BatchStatusBadge status={batch.status} />
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                    DATA DE ENTRADA
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatDate(batch.entryDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-white mt-8 p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
            <h2 className="text-base font-semibold text-[#0F172A]">Informações Adicionais</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs font-medium text-slate-600 uppercase mb-2">DATA DE CRIAÇÃO</p>
              <p className="text-sm font-medium text-[#0F172A]">{formatDate(batch.createdAt)}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                ÚLTIMA ATUALIZAÇÃO
              </p>
              <p className="text-sm font-medium text-[#0F172A]">
                {formatDateTime(batch.updatedAt)}
              </p>
            </div>
          </div>
        </div>
          </TabsContent>

          {canViewManagementPlan && (
            <TabsContent value="plano-manejo">
              <div className="mt-6 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
                <ManagementPlanSection batchId={batch.id} />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
