'use client';

import { useCreateTransfer } from '@/features/transfer';
import { TransferForm } from '@/features/transfer/components';
import type { CreateTransferFormData } from '@/features/transfer';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { CircleIcon } from '@/shared/components/icons/AppIcons';
import { demoUser } from '@/shared/constants/demoUser';

export default function TransferCreatePage() {
  const createTransfer = useCreateTransfer();

  const onSubmit = (data: CreateTransferFormData) => {
    createTransfer.mutate(data);
  };

  return (
    <DashboardLayout user={demoUser}>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Transferências / Novo"
          title="Transferência"
          subtitle="Cadastro de transferência entre tanques"
          icon={<CircleIcon className="h-6 w-6 text-[#0EA5A4]" />}
        />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <TransferForm
            mode="create"
            onSubmit={onSubmit}
            isLoading={createTransfer.isPending}
            submitLabel="Criar Transferência"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
