'use client';

import { useParams } from 'next/navigation';
import { useDeleteStock, useStock } from '@/features/stock';
import { StockDetailView } from '@/features/stock/components';
import { useAlertModal } from '@/shared/components/AlertModal';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function StockDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: stock, isLoading, error } = useStock(id);
  const deleteStock = useDeleteStock();
  const { showError } = useAlertModal();

  const handleDelete = (targetId: string, label: string) => {
    showError(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o estoque "${label}"? Esta ação não pode ser desfeita.`,
      'Sim, Excluir',
      () => deleteStock.mutate(targetId),
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !stock) {
    return (
      <DashboardLayout>
        <NotFoundState message="Estoque não encontrado." backHref="/company/stocks" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <StockDetailView
        stock={stock}
        onDelete={handleDelete}
        isDeleting={deleteStock.isPending}
      />
    </DashboardLayout>
  );
}
