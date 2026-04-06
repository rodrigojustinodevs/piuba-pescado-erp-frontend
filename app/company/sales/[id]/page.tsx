'use client';

import { useParams } from 'next/navigation';
import { useAlertModal } from '@/shared/components/AlertModal';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';
import { SaleDetailView } from '@/features/sale/components';
import { useCancelSale, useDeleteSale, useSale } from '@/features/sale';

export default function SaleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: sale, isLoading, error } = useSale(id);
  const deleteSale = useDeleteSale();
  const cancelSale = useCancelSale();
  const { showError } = useAlertModal();

  const handleCancel = (targetId: string, label: string) => {
    showError(
      'Cancelar venda',
      `Deseja cancelar a venda "${label}"? O status será alterado para cancelado.`,
      'Sim, cancelar',
      () => cancelSale.mutate(targetId),
    );
  };

  const handleDelete = (targetId: string, label: string) => {
    showError(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir a venda "${label}"? Esta ação não pode ser desfeita.`,
      'Sim, excluir',
      () => deleteSale.mutate(targetId),
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !sale) {
    return (
      <DashboardLayout>
        <NotFoundState message="Venda não encontrada." backHref="/company/sales" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SaleDetailView
        sale={sale}
        onCancel={handleCancel}
        isCancelling={cancelSale.isPending}
        onDelete={handleDelete}
        isDeleting={deleteSale.isPending}
      />
    </DashboardLayout>
  );
}
