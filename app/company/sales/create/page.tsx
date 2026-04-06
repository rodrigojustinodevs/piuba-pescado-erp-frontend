'use client';

import { SaleForm, useCreateSale } from '@/features/sale';
import type { CreateSaleData } from '@/features/sale/types';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SaleCreatePage() {
  const createSale = useCreateSale();

  const onSubmit = (data: CreateSaleData) => {
    createSale.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <div className="mb-6">
          <p className="text-sm text-slate-600">Dashboard / Vendas / Nova</p>
          <div className="mt-3">
            <h1 className="text-3xl font-bold text-[#0F172A]">Nova venda</h1>
            <p className="text-sm text-slate-600">Registre uma nova venda por cliente e lote</p>
          </div>
        </div>

        <SaleForm
          onSubmit={onSubmit}
          isSubmitting={createSale.isPending}
          submitLabel="Cadastrar venda"
          submittingLabel="Cadastrando..."
        />
      </div>
    </DashboardLayout>
  );
}

