'use client';

import { useCreateTransfer, TransferForm, TransferPageShell } from '@/features/transfer';
import type { CreateTransferFormData } from '@/features/transfer';
import { DashboardLayout } from '@/shared/components/Layout';

export default function TransferCreatePage() {
  const createTransfer = useCreateTransfer();

  const onSubmit = (data: CreateTransferFormData) => {
    createTransfer.mutate(data);
  };

  return (
    <DashboardLayout>
      <TransferPageShell
        breadcrumb="Dashboard / Transferências / Novo"
        title="Transferência"
        subtitle="Cadastro de transferência entre tanques"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <TransferForm
            mode="create"
            onSubmit={onSubmit}
            isLoading={createTransfer.isPending}
            submitLabel="Criar Transferência"
          />
        </div>
      </TransferPageShell>
    </DashboardLayout>
  );
}
