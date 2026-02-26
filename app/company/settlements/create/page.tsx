'use client';

import { useCreateSettlement, SettlementForm, SettlementPageShell } from '@/features/settlement';
import type { CreateSettlementFormData } from '@/features/settlement';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SettlementCreatePage() {
  const createSettlement = useCreateSettlement();

  const onSubmit = (data: CreateSettlementFormData) => {
    createSettlement.mutate(data);
  };

  return (
    <DashboardLayout>
      <SettlementPageShell
        breadcrumb="Dashboard / Povoamentos / Novo"
        title="Povoamento"
        subtitle="Cadastro de povoamento de lote"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <SettlementForm
            mode="create"
            onSubmit={onSubmit}
            isLoading={createSettlement.isPending}
            submitLabel="Criar Povoamento"
          />
        </div>
      </SettlementPageShell>
    </DashboardLayout>
  );
}
