'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDeleteSupplier, useSupplier } from '@/features/supplier';
import { SupplierDetailView } from '@/features/supplier/components';
import { useAlertModal } from '@/shared/components/AlertModal';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function SupplierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: supplier, isLoading, error } = useSupplier(id);
  const deleteSupplier = useDeleteSupplier();
  const { showError } = useAlertModal();

  const handleDelete = (targetId: string, label: string) => {
    showError(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o fornecedor "${label}"? Esta ação não pode ser desfeita.`,
      'Sim, Excluir',
      () =>
        deleteSupplier.mutate(targetId, {
          onSuccess: () => router.push('/company/suppliers'),
        }),
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !supplier) {
    return (
      <DashboardLayout>
        <NotFoundState message="Fornecedor não encontrado." backHref="/company/suppliers" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SupplierDetailView
        supplier={supplier}
        onDelete={handleDelete}
        isDeleting={deleteSupplier.isPending}
      />
    </DashboardLayout>
  );
}
