'use client';

import { useParams } from 'next/navigation';
import {
  useCancelPurchase,
  useDeletePurchase,
  usePurchase,
  useReceivePurchase,
} from '@/features/purchase';
import { PurchaseDetailView } from '@/features/purchase/components';
import { formatPurchaseMoney } from '@/features/purchase/utils/formatPurchaseMoney';
import { useAlertModal } from '@/shared/components/AlertModal';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function PurchaseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: purchase, isLoading, error } = usePurchase(id);
  const deletePurchase = useDeletePurchase();
  const receivePurchase = useReceivePurchase();
  const cancelPurchase = useCancelPurchase();
  const { showError, showSuccess } = useAlertModal();

  const handleDelete = (targetId: string, label: string) => {
    showError(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a compra "${label}"? Esta ação não pode ser desfeita.`,
      'Sim, Excluir',
      () => deletePurchase.mutate(targetId),
    );
  };

  const handleReceive = (targetId: string) => {
    if (!purchase) return;
    const label = `${purchase.supplierName || 'Fornecedor'} — ${formatPurchaseMoney(purchase.totalPrice)}`;
    showSuccess(
      'Confirmar Recebimento',
      `Tem certeza que deseja marcar a compra "${label}" como recebida?`,
      'Sim, Receber',
      () => receivePurchase.mutate(targetId),
    );
  };

  const handleCancel = (targetId: string) => {
    if (!purchase) return;
    const label = `${purchase.supplierName || 'Fornecedor'} — ${formatPurchaseMoney(purchase.totalPrice)}`;
    showError(
      'Confirmar Cancelamento',
      `Tem certeza que deseja cancelar a compra "${label}"?`,
      'Sim, Cancelar',
      () => cancelPurchase.mutate(targetId),
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !purchase) {
    return (
      <DashboardLayout>
        <NotFoundState message="Compra não encontrada." backHref="/company/purchases" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PurchaseDetailView
        purchase={purchase}
        onDelete={handleDelete}
        isDeleting={deletePurchase.isPending}
        onReceive={handleReceive}
        isReceiving={receivePurchase.isPending}
        onCancel={handleCancel}
        isCancelling={cancelPurchase.isPending}
      />
    </DashboardLayout>
  );
}
