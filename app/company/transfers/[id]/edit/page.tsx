'use client';

import { useParams } from 'next/navigation';
import { useTransfer, useUpdateTransfer } from '@/features/transfer';
import { TransferForm } from '@/features/transfer/components';
import type { UpdateTransferFormData } from '@/features/transfer';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { CircleIcon } from '@/shared/components/icons/AppIcons';
import { demoUser } from '@/shared/constants/demoUser';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function TransferEditPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: transfer, isLoading } = useTransfer(id);
  const updateTransfer = useUpdateTransfer();

  const onSubmit = (data: UpdateTransferFormData) => {
    updateTransfer.mutate({ ...data, id });
  };

  if (isLoading) {
    return (
      <DashboardLayout user={demoUser}>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!transfer) {
    return (
      <DashboardLayout user={demoUser}>
        <NotFoundState message="Transferência não encontrada." backHref="/company/transfers" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={demoUser}>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Transferências / Editar"
          title="Transferência"
          subtitle="Atualize as informações da transferência entre tanques"
          icon={<CircleIcon className="h-6 w-6 text-[#0EA5A4]" />}
        />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <TransferForm
            mode="update"
            initialData={transfer}
            onSubmit={onSubmit}
            isLoading={updateTransfer.isPending}
            submitLabel="Atualizar Transferência"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
