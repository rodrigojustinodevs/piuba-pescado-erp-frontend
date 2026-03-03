'use client';

import { useParams } from 'next/navigation';
import {
  useStocking,
  useUpdateStocking,
  StockingForm,
  StockingPageShell,
} from '@/features/stocking';
import type { UpdateStockingFormData } from '@/features/stocking';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function StockingEditPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: stocking, isLoading } = useStocking(id);
  const updateStocking = useUpdateStocking();

  const onSubmit = (data: UpdateStockingFormData) => {
    updateStocking.mutate({ ...data, id });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!stocking) {
    return (
      <DashboardLayout>
        <NotFoundState message="Povoamento não encontrado." backHref="/company/stockings" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <StockingPageShell
        breadcrumb="Dashboard / Povoamentos / Editar"
        title="Povoamento"
        subtitle="Atualize as informações do povoamento"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <StockingForm
            mode="update"
            initialData={stocking}
            onSubmit={onSubmit}
            isLoading={updateStocking.isPending}
            submitLabel="Atualizar Povoamento"
          />
        </div>
      </StockingPageShell>
    </DashboardLayout>
  );
}
