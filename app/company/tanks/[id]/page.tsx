"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTank, useDeleteTank, useTankLookups } from "@/features/tank";
import { DashboardLayout } from "@/shared/components/Layout";
import { useAlertModal } from "@/shared/components/AlertModal";
import { useAuthContext } from "@/shared/contexts/AuthContext";
import { formatCapacityLiters } from "@/features/tank/utils/format";
import { getCompanyName, getTankTypeLabel } from "@/features/tank/utils/lookups";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 0) {
    return `Hoje, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  if (diffDays === 1) {
    return `Ontem, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return formatDate(dateString);
}

export default function TankDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { isMaster } = useAuthContext();
  const { data: tank, isLoading, error } = useTank(id);
  const { companyMap, tankTypeMap } = useTankLookups();
  const deleteTank = useDeleteTank();
  const { showError } = useAlertModal();

  const handleDeactivate = () => {
    if (tank) {
      showError(
        "Confirmar Desativação",
        `Tem certeza que deseja desativar o tanque "${tank.name}"?`,
        "Sim, Desativar",
        () => {
          deleteTank.mutate(tank.id);
        }
      );
    }
  };

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

  if (error || !tank) {
    return (
      <DashboardLayout
        user={{
          name: "Usuário Demo",
          email: "demo@dev.com",
        }}
      >
        <div className="text-center py-8">
          <p className="text-red-600">Tanque não encontrado.</p>
          <Link
            href="/company/tanks"
            className="mt-4 inline-block text-[#0EA5A4] hover:text-[#0F766E]"
          >
            Voltar para lista
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const companyName = getCompanyName(companyMap, tank.companyId);
  const tankType = getTankTypeLabel(tankTypeMap, tank.tankTypeId);
  const capacity = formatCapacityLiters(tank.capacityLiters);

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
          Dashboard / Tanques / {tank.name}
        </p>

        {/* Main White Card */}
        <div className=" rounded-2xl border border-slate-200 shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 bg-white rounded-t-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#16A34A]/10 border-2 border-[#16A34A]/20">
                <svg className="h-8 w-8 text-[#16A34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h18M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2M6 7v14a2 2 0 002 2h8a2 2 0 002-2V7"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 11h6M9 15h6"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">{tank.name}</h1>
                <div className="flex items-center gap-3">
                  {isMaster() && (
                    <span className="text-sm text-[#0F172A]">Empresa: {companyName}</span>
                  )}
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${
                      tank.status === "active"
                        ? "bg-[#22C55E] text-white"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tank.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/company/tanks/${tank.id}/edit`}
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
              <button
                onClick={handleDeactivate}
                disabled={deleteTank.isPending}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#EF4444] hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Desativar
              </button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
              <p className="text-sm text-slate-600 mb-2">Capacidade (L)</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{capacity}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
              <p className="text-sm text-slate-600 mb-2">Tipo de Tanque</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{tankType}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
              <p className="text-sm text-slate-600 mb-2">Localização</p>
              <p className="text-2xl font-semibold text-[#0F172A]">
                {tank.location || "-"}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
              <p className="text-sm text-slate-600 mb-2">Data de criação</p>
              <p className="text-2xl font-semibold text-[#0F172A]">
                {formatDate(tank.created_at)}
              </p>
            </div>
          </div>

          {/* Informações do Tanque Section */}
          <div className="mb-8 mr-8 ml-8 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded-full bg-[#16A34A]" />
              <h2 className="text-base font-semibold text-[#0F172A]">Informações do Tanque</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna Esquerda */}
              <div className="space-y-4">
                {/* EMPRESA - card completo */}
                {isMaster() && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">EMPRESA</p>
                    <p className="text-sm font-medium text-[#0F172A]">{companyName}</p>
                  </div>
                )}
                {/* TIPO e CAPACIDADE - lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">TIPO</p>
                    <p className="text-sm font-medium text-[#0F172A]">{tankType}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">CAPACIDADE</p>
                    <p className="text-sm font-medium text-[#0F172A]">{capacity}</p>
                  </div>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-4">
                {/* LOCALIZAÇÃO - card completo */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">LOCALIZAÇÃO</p>
                  <p className="text-sm font-medium text-[#0F172A]">{tank.location || "-"}</p>
                </div>
                {/* STATUS e ÚLTIMA ATUALIZAÇÃO - lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">STATUS</p>
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1">
                      <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                      <p className="text-sm font-medium text-[#0F172A]">
                        {tank.status === "active" ? "Ativo" : "Inativo"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">ÚLTIMA ATUALIZAÇÃO</p>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {formatDateTime(tank.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monitoramento Section */}
        <div className="bg-white m-8 p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 rounded-full bg-[#16A34A]" />
            <h2 className="text-base font-semibold text-[#0F172A]">Monitoramento</h2>
          </div>

            <div className="text-center py-12 border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-slate-600">Sem sensores vinculados.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

