'use client';

import type { CreateStockingFormData, UpdateStockingFormData } from '../schemas';
import { useCreateStocking } from '../hooks/useCreateStocking';
import { useUpdateStocking } from '../hooks/useUpdateStocking';
import { StockingForm } from './StockingForm';
import { StockingDetailsDialog } from './StockingDetailsDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import type { Stocking, StockingDialogMode, UpdateStockingData } from '../types';

type StockingCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: StockingDialogMode;
  stocking: Stocking | null;
  batchMap: Record<string, string>;
  onSuccess: () => void;
  /** Chamado pelo botão "Editar" da visualização (troca o modo para 'edit'). */
  onEdit?: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes do povoamento',
    description: 'Visualize as informações principais do povoamento.',
    maxWidth: 'sm:max-w-2xl',
  },
  edit: {
    title: 'Editar povoamento',
    description: 'Atualize os dados do povoamento.',
    maxWidth: 'sm:max-w-2xl',
  },
  create: {
    title: 'Novo povoamento',
    description: 'Cadastre um novo povoamento vinculado a um lote.',
    maxWidth: 'sm:max-w-2xl',
  },
} satisfies Record<StockingDialogMode, { title: string; description: string; maxWidth: string }>;

export function StockingCreateDialog({
  open,
  onOpenChange,
  mode,
  stocking,
  batchMap,
  onSuccess,
  onEdit,
}: Readonly<StockingCreateDialogProps>) {
  const createStocking = useCreateStocking({ skipNavigateToList: true });
  const updateStocking = useUpdateStocking({ skipNavigateToList: true });

  const isLoading = createStocking.isPending || updateStocking.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  function handleSubmit(data: CreateStockingFormData | UpdateStockingFormData) {
    if (mode === 'edit') {
      if (!stocking?.id) return;
      const d = data as UpdateStockingFormData;
      const payload: UpdateStockingData = {
        id: stocking.id,
        batchId: d.batchId,
        stockingDate: d.stockingDate,
        quantity: d.quantity,
        averageWeight: d.averageWeight,
      };
      updateStocking.mutate(payload, {
        onSuccess: () => {
          onSuccess();
          handleClose();
        },
      });
      return;
    }

    createStocking.mutate(data as CreateStockingFormData, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  function renderContent() {
    if (mode === 'edit' && stocking) {
      return (
        <StockingForm
          key={`${mode}-${stocking.id}-${open ? 'open' : 'closed'}`}
          mode="update"
          initialData={stocking}
          onSubmit={handleSubmit as (d: UpdateStockingFormData) => void}
          isLoading={isLoading}
          submitLabel="Atualizar povoamento"
          onCancel={handleClose}
        />
      );
    }
    return (
      <StockingForm
        key={`create-${open ? 'open' : 'closed'}`}
        mode="create"
        onSubmit={handleSubmit as (d: CreateStockingFormData) => void}
        isLoading={isLoading}
        submitLabel="Criar povoamento"
        onCancel={handleClose}
      />
    );
  }

  if (mode === 'view') {
    return (
      <StockingDetailsDialog
        stocking={stocking ?? null}
        open={open}
        onOpenChange={onOpenChange}
        onEdit={onEdit}
        batchMap={batchMap}
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
