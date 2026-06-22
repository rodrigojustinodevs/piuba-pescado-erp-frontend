'use client';

import { useState } from 'react';
import type { Transfer, TransferDialogMode, CreateTransferData, PatchTransferPayload } from '../types';
import type { CreateTransferFormData } from '../schemas';
import type { ApiFieldError } from './TransferForm';
import { TransferForm } from './TransferForm';
import { TransferViewDialogContent } from './TransferViewDialogContent';
import { useCreateTransfer } from '../hooks/useCreateTransfer';
import { useUpdateTransfer } from '../hooks/useUpdateTransfer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';

type TransferDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: TransferDialogMode;
  transfer: Transfer | null;
  onSuccess: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes da transferência',
    description: 'Visualize as informações registradas nesta transferência.',
    maxWidth: 'sm:max-w-lg',
  },
  edit: {
    title: 'Editar transferência',
    description: 'Atualize os dados da transferência.',
    maxWidth: 'sm:max-w-2xl',
  },
  create: {
    title: 'Nova Transferência',
    description: 'Movimentação de indivíduos entre tanques.',
    maxWidth: 'sm:max-w-2xl',
  },
} satisfies Record<TransferDialogMode, { title: string; description: string; maxWidth: string }>;

function parseTransferApiError(message: string): ApiFieldError {
  if (message.includes('O lote não está no tanque de origem')) {
    return { field: 'batchId', message };
  }
  if (message.includes('Quantidade informada excede o estoque disponível')) {
    return { field: 'quantity', message };
  }
  if (message.includes('O tanque de destino já possui um lote ativo')) {
    return { field: 'destinationTankId', message };
  }
  if (message.includes('Origem e destino não podem ser o mesmo tanque')) {
    return { field: 'destinationTankId', message };
  }
  return { field: 'root', message };
}

export function TransferDialog({
  open,
  onOpenChange,
  mode,
  transfer,
  onSuccess,
}: Readonly<TransferDialogProps>) {
  const createTransfer = useCreateTransfer({ skipNavigateToList: true });
  const updateTransfer = useUpdateTransfer({ skipNavigateToList: true });
  const [apiError, setApiError] = useState<ApiFieldError>(null);

  const isViewMode = mode === 'view';
  const isLoading = createTransfer.isPending || updateTransfer.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    setApiError(null);
    onOpenChange(false);
  }

  function handleCreate(data: CreateTransferFormData) {
    setApiError(null);
    createTransfer.mutate(data as CreateTransferData, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  function handleUpdate(data: PatchTransferPayload) {
    if (!transfer?.id) return;
    setApiError(null);
    updateTransfer.mutate(data, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
      onError: (error: Error) => {
        setApiError(parseTransferApiError(error.message));
      },
    });
  }

  function renderContent() {
    if (isViewMode) {
      return (
        <>
          <TransferViewDialogContent transfer={transfer} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Fechar
            </Button>
          </DialogFooter>
        </>
      );
    }
    const openState = open ? 'open' : 'closed';
    if (mode === 'edit' && transfer) {
      return (
        <TransferForm
          key={`edit-${transfer.id}-${openState}`}
          mode="update"
          initialData={transfer}
          onSubmit={handleUpdate}
          isLoading={isLoading}
          submitLabel="Atualizar transferência"
          onCancel={handleClose}
          apiError={apiError}
        />
      );
    }
    return (
      <TransferForm
        key={`create-${openState}`}
        mode="create"
        onSubmit={handleCreate}
        isLoading={isLoading}
        submitLabel="Registrar"
        onCancel={handleClose}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-h-[90vh] overflow-y-auto bg-white ${maxWidth}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
