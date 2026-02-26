'use client';

import { useParams } from 'next/navigation';
import { useBatch, useUpdateBatch, BatchForm, BatchPageShell } from '@/features/batch';
import type { UpdateBatchFormData } from '@/features/batch';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function BatchEditPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: batch, isLoading } = useBatch(id);
  const updateBatch = useUpdateBatch();

  const onSubmit = (data: UpdateBatchFormData) => {
    updateBatch.mutate({ ...data, id });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!batch) {
    return (
      <DashboardLayout>
        <NotFoundState message="Lote não encontrado." backHref="/company/batches" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <BatchPageShell
        breadcrumb="Dashboard / Lotes / Editar"
        title="Lote"
        subtitle="Atualize as informações do lote de cultivo"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <BatchForm
            mode="update"
            initialData={batch}
            onSubmit={onSubmit}
            isLoading={updateBatch.isPending}
            submitLabel="Atualizar Lote"
          />
        </div>
      </BatchPageShell>
    </DashboardLayout>
  );
}
