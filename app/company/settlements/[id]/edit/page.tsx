'use client';

import { useParams } from 'next/navigation';
import {
  useSettlement,
  useUpdateSettlement,
  SettlementForm,
  SettlementPageShell,
} from '@/features/settlement';
import type { UpdateSettlementFormData } from '@/features/settlement';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function SettlementEditPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: settlement, isLoading } = useSettlement(id);
  const updateSettlement = useUpdateSettlement();

  const onSubmit = (data: UpdateSettlementFormData) => {
    updateSettlement.mutate({ ...data, id });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!settlement) {
    return (
      <DashboardLayout>
        <NotFoundState message="Povoamento não encontrado." backHref="/company/settlements" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SettlementPageShell
        breadcrumb="Dashboard / Povoamentos / Editar"
        title="Povoamento"
        subtitle="Atualize as informações do povoamento"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <SettlementForm
            mode="update"
            initialData={settlement}
            onSubmit={onSubmit}
            isLoading={updateSettlement.isPending}
            submitLabel="Atualizar Povoamento"
          />
        </div>
      </SettlementPageShell>
    </DashboardLayout>
  );
}
