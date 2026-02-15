'use client';

import { useCreateBatch } from '@/features/batch';
import { BatchForm } from '@/features/batch/components';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { demoUser } from '@/shared/constants/demoUser';

export default function BatchCreatePage() {
  const createBatch = useCreateBatch();

  const onSubmit = (data: Parameters<typeof createBatch.mutate>[0]) => {
    createBatch.mutate(data);
  };

  return (
    <DashboardLayout user={demoUser}>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Lotes / Novo"
          title="Lote"
          subtitle="Cadastro de lote de cultivo"
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
            mode="create"
            onSubmit={onSubmit}
            isLoading={createBatch.isPending}
            submitLabel="Criar Lote"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
