"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCompany, useDeleteCompany } from "@/features/company";
import { useAlertModal } from "@/shared/components/AlertModal";
import { DemoDashboardLayout } from "@/app/_components/DemoDashboardLayout";
import { LoadingState, NotFoundState } from "@/app/_components/PageStates";
import { BuildingIcon, PencilIcon, TrashIcon } from "@/app/_components/AppIcons";
import { formatDatePtBR, formatRelativeDateTimePtBR } from "@/shared/utils/dateFormat";

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: company, isLoading, error } = useCompany(id);
  const deleteCompany = useDeleteCompany();
  const { showError } = useAlertModal();

  const handleDeactivate = () => {
    if (company) {
      showError(
        "Confirmar Desativação",
        `Tem certeza que deseja desativar a empresa "${company.name}"?`,
        "Sim, Desativar",
        () => {
          deleteCompany.mutate(company.id);
        }
      );
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !company) {
    return <NotFoundState message="Empresa não encontrada." backHref="/admin/companies" />;
  }

  return (
    <DemoDashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        {/* Breadcrumb */}
        <p className="text-sm text-slate-600 mb-4">
          Dashboard / Empresas / {company.name}
        </p>

        {/* Main White Card */}
        <div className="rounded-2xl border border-slate-200 shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 bg-white rounded-t-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#16A34A]/10 border-2 border-[#16A34A]/20">
                <BuildingIcon className="h-8 w-8 text-[#16A34A]" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">{company.name}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#0F172A]">Unidade aquícola</span>
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${
                      company.active
                        ? "bg-[#22C55E] text-white"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {company.active ? "Ativa" : "Inativa"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/admin/companies/${company.id}/edit`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
              >
                <PencilIcon className="h-4 w-4" />
                Editar
              </Link>
              <button
                onClick={handleDeactivate}
                disabled={deleteCompany.isPending}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#EF4444] hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon className="h-4 w-4" />
                Desativar
              </button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <p className="text-sm text-slate-600 mb-2">Localização</p>
              <p className="text-2xl font-semibold text-[#0F172A]">
                {company.address.city && company.address.state
                  ? `${company.address.city}, ${company.address.state}`
                  : "-"}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <p className="text-sm text-slate-600 mb-2">Tanques ativos</p>
              <p className="text-2xl font-semibold text-[#0F172A]">—</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <p className="text-sm text-slate-600 mb-2">Sensores online</p>
              <p className="text-2xl font-semibold text-[#0F172A]">—</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <p className="text-sm text-slate-600 mb-2">Data de criação</p>
              <p className="text-2xl font-semibold text-[#0F172A]">
                {formatDatePtBR(company.created_at)}
              </p>
            </div>
          </div>

          {/* Informações Básicas Section */}
          <div className="mb-8 mr-8 ml-8 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded-full bg-[#16A34A]" />
              <h2 className="text-base font-semibold text-[#0F172A]">Informações Básicas</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna Esquerda */}
              <div className="space-y-4">
                {/* NOME - card completo */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">NOME</p>
                  <p className="text-sm font-medium text-[#0F172A]">{company.name}</p>
                </div>
                {/* CNPJ e CONTATO - lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">CNPJ</p>
                    <p className="text-sm font-medium text-[#0F172A]">{company.cnpj}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">CONTATO</p>
                    <p className="text-sm font-medium text-[#0F172A]">{company.email || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-4">
                {/* TELEFONE - card completo */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">TELEFONE</p>
                  <p className="text-sm font-medium text-[#0F172A]">{company.phone || "-"}</p>
                </div>
                {/* STATUS e ÚLTIMA ATUALIZAÇÃO - lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">STATUS</p>
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1">
                      <span className={`h-2 w-2 rounded-full ${company.active ? "bg-[#22C55E]" : "bg-red-500"}`} />
                      <p className="text-sm font-medium text-[#0F172A]">
                        {company.active ? "Ativa" : "Inativa"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">ÚLTIMA ATUALIZAÇÃO</p>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {formatRelativeDateTimePtBR(company.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço Section */}
          <div className="mb-8 mr-8 ml-8 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded-full bg-[#16A34A]" />
              <h2 className="text-base font-semibold text-[#0F172A]">Endereço</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna Esquerda */}
              <div className="space-y-4">
                {/* RUA - card completo */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">RUA</p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {company.address.street && company.address.number
                      ? `${company.address.street}, ${company.address.number}`
                      : "-"}
                  </p>
                </div>
                {/* BAIRRO e CEP - lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">BAIRRO</p>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {company.address.neighborhood || "-"}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">CEP</p>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {company.address.zipCode || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-4">
                {/* CIDADE/ESTADO - card completo */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">CIDADE/ESTADO</p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {company.address.city && company.address.state
                      ? `${company.address.city} • ${company.address.state}`
                      : "-"}
                  </p>
                </div>
                {/* COMPLEMENTO - card completo */}
                {company.address.complement && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">COMPLEMENTO</p>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {company.address.complement}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>


        </div>
      </div>
    </DemoDashboardLayout>
  );
}

