'use client';

import { useParams } from 'next/navigation';
import { useBatch, useUpdateBatch } from '@/features/batch';
import { BatchForm } from '@/features/batch/components';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { demoUser } from '@/shared/constants/demoUser';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function BatchEditPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: batch, isLoading } = useBatch(id);
  const updateBatch = useUpdateBatch();

  const onSubmit = (data: Parameters<typeof updateBatch.mutate>[0]) => {
    updateBatch.mutate({ ...data, id });
  };

  if (isLoading) {
    return (
      <DashboardLayout user={demoUser}>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!batch) {
    return (
      <DashboardLayout user={demoUser}>
        <NotFoundState message="Lote não encontrado." backHref="/company/batches" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={demoUser}>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Lotes / Editar"
          title="Lote"
          subtitle="Atualize as informações do lote de cultivo"
          icon={
            <svg
              className="h-6 w-6 text-[#0EA5A4]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              />
            </svg>
          }
        />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <BatchForm
            mode="update"
            initialData={batch}
            onSubmit={onSubmit}
            isLoading={updateBatch.isPending}
            submitLabel="Atualizar Lote"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
