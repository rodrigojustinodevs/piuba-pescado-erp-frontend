"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTank, useDeleteTank, useTankTypes } from "@/features/tank";
import { DashboardLayout } from "@/shared/components/Layout";
import { useAlertModal } from "@/shared/components/AlertModal";
import { useCompanies } from "@/features/company";
import { useAuthContext } from "@/shared/contexts/AuthContext";

export default function TankDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { isMaster } = useAuthContext();
  const { data: tank, isLoading, error } = useTank(id);
  const { data: companiesData } = useCompanies({ limit: 1000 });
  const companies = companiesData?.companies || [];
  const { data: tankTypes = [] } = useTankTypes();
  const deleteTank = useDeleteTank();
  const { showError } = useAlertModal();

  const handleDelete = () => {
    if (tank) {
      showError(
        "Confirmar Exclusão",
        `Tem certeza que deseja excluir o tanque "${tank.name}"? Esta ação não pode ser desfeita.`,
        "Sim, Excluir",
        () => {
          deleteTank.mutate(tank.id);
        }
      );
    }
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    return company?.name || "N/A";
  };

  const getTankTypeLabel = (typeId: string | undefined) => {
    if (!typeId) return "-";
    const tankType = tankTypes.find((t) => t.id === typeId);
    return tankType?.name || typeId;
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
          <div className="flex items-center justify-center gap-2 text-gray-500">
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
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tank.name}</h1>
            <p className="text-gray-600">Detalhes do tanque</p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleteTank.isPending}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {deleteTank.isPending && (
              <svg
                className="w-4 h-4 animate-spin"
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
            )}
            {deleteTank.isPending ? "Excluindo..." : "Excluir"}
          </button>
        </div>

        {/* Informações Básicas Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Informações Básicas</h2>
            <Link
              href={`/company/tanks/${tank.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium text-sm"
            >
              <svg
                className="w-4 h-4"
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
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Nome</label>
              <p className="text-base font-semibold text-gray-900">{tank.name}</p>
            </div>
            {isMaster() && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Empresa</label>
                <p className="text-base font-semibold text-gray-900">{getCompanyName(tank.companyId)}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Capacidade</label>
              <p className="text-base font-semibold text-gray-900">
                {tank.capacityLiters
                  ? tank.capacityLiters.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) + " L"
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Tipo</label>
              <p className="text-base font-semibold text-gray-900">{getTankTypeLabel(tank.tankTypeId)}</p>
            </div>
            {tank.location && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Localização</label>
                <p className="text-base font-semibold text-gray-900">{tank.location}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Status</label>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  tank.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {tank.status === "active" ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

