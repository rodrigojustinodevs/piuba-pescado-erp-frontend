"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useBatch } from "@/features/batch";
import { BatchStatusBadge } from "@/features/batch/components";
import { DashboardLayout } from "@/shared/components/Layout";
import { formatDate, formatQuantity, getCultivationLabel, formatDateTime } from "@/features/batch/utils/format";

export default function BatchDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: batch, isLoading, error } = useBatch(id);

  if (isLoading) {
    return (
      <DashboardLayout
        user={{
          name: "Usuário Demo",
          email: "demo@dev.com",
        }}
      >
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Carregando...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !batch) {
    return (
      <DashboardLayout
        user={{
          name: "Usuário Demo",
          email: "demo@dev.com",
        }}
      >
        <div className="text-center py-8">
          <p className="text-red-600">Lote não encontrado.</p>
          <Link
            href="/company/batches"
            className="mt-4 inline-block text-[#0EA5A4] hover:text-[#0F766E]"
          >
            Voltar para lista
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={{
        name: "Usuário Demo",
        email: "demo@dev.com",
      }}
    >
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        {/* Breadcrumb */}
        <p className="text-sm text-slate-600 mb-4">
          Dashboard / Lotes / {batch?.id ? `${batch.id.slice(0, 8)}…` : "—"}
        </p>

        {/* Main White Card */}
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
                <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">
                  Lote {batch?.id ? `${batch.id.slice(0, 8)}…` : "—"}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#0F172A]">
                    Tanque: {batch.tank?.name || "—"}
                  </span>
                  <BatchStatusBadge status={batch.status} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/company/batches/${batch.id}/edit`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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

          {/* Key Metrics Cards */}
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
              <p className="text-2xl font-semibold text-[#0F172A]">
                {formatDate(batch.entryDate)}
              </p>
            </div>
          </div>

          {/* Informações do Lote Section */}
          <div className="mb-8 mr-8 ml-8 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
              <h2 className="text-base font-semibold text-[#0F172A]">Informações do Lote</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna Esquerda */}
              <div className="space-y-4">
                {/* TANQUE - card completo */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">TANQUE</p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {batch.tank?.name || "—"}
                  </p>
                </div>
                {/* ESPÉCIE e QUANTIDADE INICIAL - lado a lado */}
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

              {/* Coluna Direita */}
              <div className="space-y-4">
                {/* TIPO DE CULTIVO - card completo */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                    TIPO DE CULTIVO
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {getCultivationLabel(batch.cultivation)}
                  </p>
                </div>
                {/* STATUS e DATA DE ENTRADA - lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">STATUS</p>
                    <div className="inline-flex items-center gap-2">
                      <BatchStatusBadge status={batch.status} />
                    </div>
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

          {/* Informações Adicionais Section */}
          <div className="bg-white m-8 p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
              <h2 className="text-base font-semibold text-[#0F172A]">Informações Adicionais</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                  DATA DE CRIAÇÃO
                </p>
                <p className="text-sm font-medium text-[#0F172A]">
                  {formatDate(batch.createdAt)}
                </p>
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
        </div>
      </div>
    </DashboardLayout>
  );
}
