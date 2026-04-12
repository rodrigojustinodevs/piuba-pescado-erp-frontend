'use client';

import {
  BatchDistributionForm,
  BatchPageShell,
  useDistributeBatch,
  type BatchDistributionFormData,
} from '@/features/batch';
import { DashboardLayout } from '@/shared/components/Layout';

export default function BatchDistributionPage() {
  const distribute = useDistributeBatch();

  const onSubmit = (data: BatchDistributionFormData) => {
    distribute.mutate(data);
  };

  return (
    <DashboardLayout>
      <BatchPageShell
        breadcrumb="Dashboard / Lotes / Entrada com distribuição"
        title="Entrada de lote"
        subtitle="Registre a entrada com distribuição entre tanques"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <BatchDistributionForm onSubmit={onSubmit} isLoading={distribute.isPending} />
        </div>
      </BatchPageShell>
    </DashboardLayout>
  );
}
