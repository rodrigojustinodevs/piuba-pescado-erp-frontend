'use client';

import { useCreateSettlement } from '@/features/settlement';
import { SettlementForm } from '@/features/settlement/components';
import type { CreateSettlementFormData } from '@/features/settlement';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { CircleIcon } from '@/shared/components/icons/AppIcons';
import { demoUser } from '@/shared/constants/demoUser';

export default function SettlementCreatePage() {
  const createSettlement = useCreateSettlement();

  const onSubmit = (data: CreateSettlementFormData) => {
    createSettlement.mutate(data);
  };

  return (
    <DashboardLayout user={demoUser}>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Povoamentos / Novo"
          title="Povoamento"
          subtitle="Cadastro de povoamento de lote"
          icon={<CircleIcon className="h-6 w-6 text-[#0EA5A4]" />}
        />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <SettlementForm
            mode="create"
            onSubmit={onSubmit}
            isLoading={createSettlement.isPending}
            submitLabel="Criar Povoamento"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
