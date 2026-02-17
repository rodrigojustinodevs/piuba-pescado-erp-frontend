'use client';

import { useParams } from 'next/navigation';
import { useSettlement, useUpdateSettlement } from '@/features/settlement';
import { SettlementForm } from '@/features/settlement/components';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { CircleIcon } from '@/shared/components/icons/AppIcons';
import { demoUser } from '@/shared/constants/demoUser';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function SettlementEditPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: settlement, isLoading } = useSettlement(id);
  const updateSettlement = useUpdateSettlement();

  const onSubmit = (data: Parameters<typeof updateSettlement.mutate>[0]) => {
    updateSettlement.mutate({ ...data, id });
  };

  if (isLoading) {
    return (
      <DashboardLayout user={demoUser}>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!settlement) {
    return (
      <DashboardLayout user={demoUser}>
        <NotFoundState message="Povoamento não encontrado." backHref="/company/settlements" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={demoUser}>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Povoamentos / Editar"
          title="Povoamento"
          subtitle="Atualize as informações do povoamento"
          icon={<CircleIcon className="h-6 w-6 text-[#0EA5A4]" />}
        />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <SettlementForm
            mode="update"
            initialData={settlement}
            onSubmit={onSubmit}
            isLoading={updateSettlement.isPending}
            submitLabel="Atualizar Povoamento"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
