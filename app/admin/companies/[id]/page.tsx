"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCompany, useDeleteCompany } from "@/features/company";
import { DashboardLayout } from "@/shared/components/Layout";
import { useAlertModal } from "@/shared/components/AlertModal";

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: company, isLoading, error } = useCompany(id);
  const deleteCompany = useDeleteCompany();
  const { showError } = useAlertModal();

  const handleDelete = () => {
    if (company) {
      showError(
        "Confirmar Exclusão",
        `Tem certeza que deseja excluir a empresa "${company.name}"? Esta ação não pode ser desfeita.`,
        "Sim, Excluir",
        () => {
          deleteCompany.mutate(company.id);
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

  if (error || !company) {
    return (
      <DashboardLayout
        user={{
          name: "Usuário Demo",
          email: "demo@dev.com",
        }}
      >
        <div className="text-center py-8">
          <p className="text-red-600">Empresa não encontrada.</p>
          <Link
            href="/admin/companies"
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
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-600">Detalhes da empresa</p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleteCompany.isPending}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {deleteCompany.isPending && (
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
            {deleteCompany.isPending ? "Excluindo..." : "Excluir"}
          </button>
        </div>

        {/* Informações Básicas Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Informações Básicas</h2>
            <Link
              href={`/admin/companies/${company.id}/edit`}
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
              <p className="text-base font-semibold text-gray-900">{company.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">CNPJ</label>
              <p className="text-base font-semibold text-gray-900">{company.cnpj}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">E-mail</label>
              <p className="text-base font-semibold text-gray-900">{company.email || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Telefone</label>
              <p className="text-base font-semibold text-gray-900">{company.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Status</label>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  company.active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {company.active ? "Ativa" : "Inativa"}
              </span>
            </div>
          </div>
        </div>

        {/* Endereço Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Endereço</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Rua</label>
              <p className="text-base font-semibold text-gray-900">
                {company.address.street && company.address.number
                  ? `${company.address.street}, ${company.address.number}${company.address.complement ? ` - ${company.address.complement}` : ""}`
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Bairro</label>
              <p className="text-base font-semibold text-gray-900">{company.address.neighborhood || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Cidade/Estado</label>
              <p className="text-base font-semibold text-gray-900">
                {company.address.city && company.address.state
                  ? `${company.address.city}, ${company.address.state}`
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">CEP</label>
              <p className="text-base font-semibold text-gray-900">{company.address.zipCode || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

