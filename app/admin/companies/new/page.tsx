"use client";

import { useCreateCompany } from "@/features/company";
import { CompanyForm } from "@/features/company/components";
import { DashboardLayout } from "@/shared/components/Layout";
import type { CreateCompanyFormData } from "@/features/company";

export default function NewCompanyPage() {
  const createCompany = useCreateCompany();

  const handleSubmit = (data: CreateCompanyFormData) => {
    createCompany.mutate(data);
  };

  return (
    <DashboardLayout
      user={{
        name: "Usuário Demo",
        email: "demo@dev.com",
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Empresa</h1>
          <p className="text-gray-600">Cadastre uma nova empresa no sistema</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <CompanyForm
            onSubmit={handleSubmit}
            isLoading={createCompany.isPending}
            submitLabel="Criar Empresa"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

