'use client';

import { useCreateStocking, StockingForm, StockingPageShell } from '@/features/stocking';
import type { CreateStockingFormData } from '@/features/stocking';
import { DashboardLayout } from '@/shared/components/Layout';

export default function StockingCreatePage() {
  const createStocking = useCreateStocking();

  const onSubmit = (data: CreateStockingFormData) => {
    createStocking.mutate(data);
  };

  return (
    <DashboardLayout>
      <StockingPageShell
        breadcrumb="Dashboard / Povoamentos / Novo"
        title="Povoamento"
        subtitle="Cadastro de povoamento de lote"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <StockingForm
            mode="create"
            onSubmit={onSubmit}
            isLoading={createStocking.isPending}
            submitLabel="Criar Povoamento"
          />
        </div>
      </StockingPageShell>
    </DashboardLayout>
  );
}
