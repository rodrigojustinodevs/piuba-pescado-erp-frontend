'use client';

import { PurchaseForm, useCreatePurchase } from '@/features/purchase';
import type { CreatePurchaseData } from '@/features/purchase/types';
import { DashboardLayout } from '@/shared/components/Layout';

export default function PurchaseCreatePage() {
  const createPurchase = useCreatePurchase();

  const onSubmit = (data: CreatePurchaseData) => {
    createPurchase.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <div className="mb-6">
          <p className="text-sm text-slate-600">Dashboard / Compras / Nova</p>
          <div className="mt-3">
            <h1 className="text-3xl font-bold text-[#0F172A]">Nova compra</h1>
            <p className="text-sm text-slate-600">Registre fornecedor, data e itens da compra</p>
          </div>
        </div>

        <PurchaseForm
          onSubmit={onSubmit}
          isSubmitting={createPurchase.isPending}
          submitLabel="Registrar compra"
          submittingLabel="Registrando..."
        />
      </div>
    </DashboardLayout>
  );
}
