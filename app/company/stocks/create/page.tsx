'use client';

import { StockForm, useCreateStock } from '@/features/stock';
import type { CreateStockData } from '@/features/stock/types';
import { DashboardLayout } from '@/shared/components/Layout';

export default function StockCreatePage() {
  const createStock = useCreateStock();

  const onSubmit = (data: CreateStockData) => {
    createStock.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <div className="mb-6">
          <p className="text-sm text-slate-600">Dashboard / Estoques / Novo</p>
          <div className="mt-3">
            <h1 className="text-3xl font-bold text-[#0F172A]">Novo estoque</h1>
            <p className="text-sm text-slate-600">Cadastre insumo, fornecedor e quantidades</p>
          </div>
        </div>

        <StockForm
          onSubmit={onSubmit}
          isSubmitting={createStock.isPending}
          submitLabel="Cadastrar estoque"
          submittingLabel="Cadastrando..."
        />
      </div>
    </DashboardLayout>
  );
}
