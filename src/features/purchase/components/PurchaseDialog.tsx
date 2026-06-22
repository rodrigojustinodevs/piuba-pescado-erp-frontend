'use client';

import { useState } from 'react';
import type {
  Purchase,
  PurchaseDialogMode,
  CreatePurchaseData,
} from '../types';
import type { CreatePurchaseFormData } from '../schemas';
import { PurchaseForm } from './PurchaseForm';
import { PurchaseViewDialogContent } from './PurchaseViewDialogContent';
import { PurchaseReceiveDialog } from './PurchaseReceiveDialog';
import { PurchasePaymentDialog } from './PurchasePaymentDialog';
import { useCreatePurchase } from '../hooks/useCreatePurchase';
import { useUpdatePurchase } from '../hooks/useUpdatePurchase';
import { useCancelPurchase } from '../hooks/useCancelPurchase';
import { useAlertModal } from '@/shared/components/AlertModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';

type PurchaseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: PurchaseDialogMode;
  purchase: Purchase | null;
  onSuccess: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes da compra',
    description: 'Visualize as informações registradas nesta compra.',
    maxWidth: 'sm:max-w-4xl',
  },
  edit: {
    title: 'Editar compra',
    description: 'Atualize os dados da compra.',
    maxWidth: 'sm:max-w-5xl',
  },
  create: {
    title: 'Novo pedido de compra',
    description:
      'Registre um pedido com múltiplos itens, fornecedor, frete e condições de pagamento.',
    maxWidth: 'sm:max-w-5xl',
  },
} satisfies Record<PurchaseDialogMode, { title: string; description: string; maxWidth: string }>;

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return '';
  const match = /^\d{4}-\d{2}-\d{2}/.exec(value);
  return match ? match[0] : '';
}

export function PurchaseDialog({
  open,
  onOpenChange,
  mode,
  purchase,
  onSuccess,
}: Readonly<PurchaseDialogProps>) {
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const createPurchase = useCreatePurchase({ skipNavigateToList: true });
  const updatePurchase = useUpdatePurchase({ skipNavigateToList: true });
  const cancelPurchase = useCancelPurchase();
  const { showError } = useAlertModal();

  const isViewMode = mode === 'view';
  const isLoading = createPurchase.isPending || updatePurchase.isPending;
  const isReceiving = false;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  function handleCreate(data: CreatePurchaseData) {
    createPurchase.mutate(data, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  function handleUpdate(data: CreatePurchaseData) {
    if (!purchase?.id) return;
    updatePurchase.mutate({ ...data, id: purchase.id }, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  function handleReceive(_id: string) {
    setReceiveDialogOpen(true);
  }

  function handleCancel(id: string) {
    showError(
      'Confirmar Cancelamento',
      `Tem certeza que deseja cancelar esta compra?`,
      'Sim, Cancelar',
      () => cancelPurchase.mutate(id),
    );
  }

  const editInitialValues: CreatePurchaseFormData | undefined =
    purchase && mode === 'edit'
      ? {
          companyId: purchase.companyId ?? '',
          referenceCode: purchase.referenceCode ?? '',
          supplierId: purchase.supplierId ?? '',
          supplierDocument: '',
          responsibleName: purchase.responsibleName ?? '',
          invoiceNumber: purchase.invoiceNumber ?? '',
          orderDate: toDateInputValue(purchase.orderDate),
          expectedDeliveryDate: toDateInputValue(purchase.expectedDeliveryDate),
          status: purchase.status as CreatePurchaseFormData['status'],
          paymentMethod: purchase.paymentMethod ?? '',
          items: purchase.items.map((item) => ({
            supplyId: item.supplyId,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            discount: 0,
          })),
          freightCost: purchase.freightCost ?? 0,
          otherCosts: purchase.otherCosts ?? 0,
          notes: purchase.notes ?? '',
        }
      : undefined;

  function renderContent() {
    if (isViewMode) {
      return (
        <>
          <PurchaseViewDialogContent
            purchase={purchase}
            onReceive={handleReceive}
            isReceiving={isReceiving}
            onCancel={handleCancel}
            isCancelling={cancelPurchase.isPending}
            onOpenPaymentDialog={() => setPaymentDialogOpen(true)}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Fechar
            </Button>
          </DialogFooter>
        </>
      );
    }
    if (mode === 'edit' && purchase) {
      return (
        <PurchaseForm
          key={`edit-${purchase.id}-${open ? 'open' : 'closed'}`}
          initialValues={editInitialValues}
          onSubmit={handleUpdate}
          onCancel={handleClose}
          isSubmitting={isLoading}
          submitLabel="Atualizar compra"
          submittingLabel="Atualizando..."
          statusOptions={[
            'draft',
            'submitted',
            'approved',
            'partially_received',
            'received',
            'cancelled',
          ]}
          inDialog
        />
      );
    }
    return (
      <PurchaseForm
        key={`create-${open ? 'open' : 'closed'}`}
        onSubmit={handleCreate}
        onCancel={handleClose}
        isSubmitting={isLoading}
        submitLabel="Registrar compra"
        submittingLabel="Registrando..."
        inDialog
      />
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`max-h-[90vh] overflow-y-auto bg-white ${maxWidth}`}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {renderContent()}
        </DialogContent>
      </Dialog>

      <PurchaseReceiveDialog
        open={receiveDialogOpen}
        onOpenChange={setReceiveDialogOpen}
        purchase={purchase}
        onSuccess={() => {
          setReceiveDialogOpen(false);
          onSuccess();
          handleClose();
        }}
      />

      <PurchasePaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        purchase={purchase}
      />
    </>
  );
}
