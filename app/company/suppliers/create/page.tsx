'use client';

import { SupplierForm, useCreateSupplier } from '@/features/supplier';
import type { CreateSupplierData } from '@/features/supplier/types';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SupplierCreatePage() {
  const createSupplier = useCreateSupplier();

  const onSubmit = (data: CreateSupplierData) => {
    createSupplier.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <div className="mb-6">
          <p className="text-sm text-slate-600">Dashboard / Fornecedores / Novo</p>
          <div className="mt-3">
            <h1 className="text-3xl font-bold text-[#0F172A]">Novo fornecedor</h1>
            <p className="text-sm text-slate-600">Cadastre os dados de contato do fornecedor</p>
          </div>
        </div>

        <SupplierForm
          onSubmit={onSubmit}
          isSubmitting={createSupplier.isPending}
          submitLabel="Cadastrar fornecedor"
          submittingLabel="Cadastrando..."
        />
      </div>
    </DashboardLayout>
  );
}
