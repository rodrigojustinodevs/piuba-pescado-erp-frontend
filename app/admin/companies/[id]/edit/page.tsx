'use client';

import { useParams } from 'next/navigation';
import { useCompany, useUpdateCompany } from '@/features/company';
import { CompanyForm } from '@/features/company/components';
import { DashboardLayout } from '@/shared/components/Layout';
import type { CreateCompanyFormData } from '@/features/company';

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
          name: 'Usuário Demo',
          email: 'demo@dev.com',
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
          name: 'Usuário Demo',
          email: 'demo@dev.com',
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
        name: 'Usuário Demo',
        email: 'demo@dev.com',
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Editar Empresa</h1>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-base text-[#0F172A]">
              {company.name} • Empresa {company.active ? 'ativa' : 'inativa'}
            </p>
          </div>
          <div className="mt-3">
            <div
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 ${
                company.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {company.active ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <span className="text-sm font-medium">{company.active ? 'Ativa' : 'Inativa'}</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <CompanyForm
            initialData={company}
            onSubmit={handleSubmit}
            isLoading={updateCompany.isPending}
            submitLabel="Salvar"
            isEditMode
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
