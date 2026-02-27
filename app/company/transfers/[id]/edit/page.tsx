'use client';

import { useParams } from 'next/navigation';
import {
  useTransfer,
  useUpdateTransfer,
  TransferForm,
  TransferPageShell,
} from '@/features/transfer';
import type { UpdateTransferFormData } from '@/features/transfer';
import { DashboardLayout } from '@/shared/components/Layout';
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
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!transfer) {
    return (
      <DashboardLayout>
        <NotFoundState message="Transferência não encontrada." backHref="/company/transfers" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TransferPageShell
        breadcrumb="Dashboard / Transferências / Editar"
        title="Transferência"
        subtitle="Atualize as informações da transferência entre tanques"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <TransferForm
            mode="update"
            initialData={transfer}
            onSubmit={onSubmit}
            isLoading={updateTransfer.isPending}
            submitLabel="Atualizar Transferência"
          />
        </div>
      </TransferPageShell>
    </DashboardLayout>
  );
}
