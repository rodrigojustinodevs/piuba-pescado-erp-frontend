'use client';

import {
  useCreateBatch,
  useDistributeBatch,
  isBatchDistributionData,
  BatchForm,
  BatchPageShell,
} from '@/features/batch';
import type { CreateBatchFormData, BatchDistributionFormData } from '@/features/batch';
import { DashboardLayout } from '@/shared/components/Layout';

export default function BatchCreatePage() {
  const createBatch = useCreateBatch();
  const distributeBatch = useDistributeBatch();

  const onSubmit = (data: CreateBatchFormData | BatchDistributionFormData) => {
    if (isBatchDistributionData(data)) {
      distributeBatch.mutate(data);
    } else {
      createBatch.mutate(data);
    }
  };

  return (
    <DashboardLayout>
      <BatchPageShell
        breadcrumb="Dashboard / Lotes / Novo"
        title="Lote"
        subtitle="Cadastro de lote de cultivo"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <BatchForm
            mode="create"
            onSubmit={onSubmit}
            isLoading={createBatch.isPending || distributeBatch.isPending}
            submitLabel="Criar Lote"
          />
        </div>
      </BatchPageShell>
    </DashboardLayout>
  );
}
