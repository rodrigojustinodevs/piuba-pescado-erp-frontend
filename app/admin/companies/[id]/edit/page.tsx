"use client";

import { useParams } from "next/navigation";
import { useCompany, useUpdateCompany } from "@/features/company";
import { CompanyForm } from "@/features/company/components";
import { DashboardLayout } from "@/shared/components/Layout";
import type { CreateCompanyFormData } from "@/features/company";

export default function EditCompanyPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: company, isLoading } = useCompany(id);
  const updateCompany = useUpdateCompany();

  const handleSubmit = (data: CreateCompanyFormData) => {
    updateCompany.mutate({ ...data, id });
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

  if (!company) {
    return (
      <DashboardLayout
        user={{
          name: "Usuário Demo",
          email: "demo@dev.com",
        }}
      >
        <div className="text-center py-8">
          <p className="text-red-600">Empresa não encontrada.</p>
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Empresa</h1>
          <p className="text-gray-600">Atualize as informações da empresa</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <CompanyForm
            initialData={company}
            onSubmit={handleSubmit}
            isLoading={updateCompany.isPending}
            submitLabel="Atualizar Empresa"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

