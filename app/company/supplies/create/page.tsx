'use client';

import { SupplyForm, useCreateSupply } from '@/features/supply';
import type { CreateSupplyData } from '@/features/supply/types';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SupplyCreatePage() {
  const createSupply = useCreateSupply();

  const onSubmit = (data: CreateSupplyData) => {
    createSupply.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <div className="mb-6">
          <p className="text-sm text-slate-600">Dashboard / Produtos / Novo</p>
          <div className="mt-3">
            <h1 className="text-3xl font-bold text-[#0F172A]">Novo produto</h1>
            <p className="text-sm text-slate-600">Cadastre um produto/insumo</p>
          </div>
        </div>

        <SupplyForm
          onSubmit={onSubmit}
          isSubmitting={createSupply.isPending}
          submitLabel="Cadastrar produto"
          submittingLabel="Cadastrando..."
        />
      </div>
    </DashboardLayout>
  );
}

