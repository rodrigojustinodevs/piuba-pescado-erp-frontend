'use client';

import type { CreateFeedingFormData } from '../schemas';
import { useCreateFeeding } from '../hooks/useCreateFeeding';
import { useUpdateFeeding } from '../hooks/useUpdateFeeding';
import { FeedingForm, toDateTimeLocalValue } from './FeedingForm';
import { FeedingDetailsDialog } from './FeedingDetailsDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import type { CreateFeedingData, Feeding, FeedingDialogMode, UpdateFeedingData } from '../types';

type FeedingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FeedingDialogMode;
  feeding: Feeding | null;
  onSuccess: () => void;
  /** Chamado pelo botão "Editar" da visualização (troca o modo para 'edit'). */
  onEdit?: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes da alimentação',
    description: 'Visualize as informações principais do registro.',
    maxWidth: 'sm:max-w-2xl',
  },
  edit: {
    title: 'Editar alimentação',
    description: 'Atualize os dados da alimentação.',
    maxWidth: 'sm:max-w-2xl',
  },
  create: {
    title: 'Nova alimentação',
    description: 'Cadastre uma nova alimentação vinculada a um lote.',
    maxWidth: 'sm:max-w-2xl',
  },
} satisfies Record<FeedingDialogMode, { title: string; description: string; maxWidth: string }>;

export function FeedingDialog({
  open,
  onOpenChange,
  mode,
  feeding,
  onSuccess,
  onEdit,
}: Readonly<FeedingDialogProps>) {
  const createFeeding = useCreateFeeding({ skipNavigateToList: true });
  const updateFeeding = useUpdateFeeding({ skipNavigateToList: true });

  const isLoading = createFeeding.isPending || updateFeeding.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  function handleSubmit(data: CreateFeedingData) {
    if (mode === 'edit') {
      if (!feeding?.id) return;
      const payload: UpdateFeedingData = { id: feeding.id, ...data };
      updateFeeding.mutate(payload, {
        onSuccess: () => {
          onSuccess();
          handleClose();
        },
      });
      return;
    }

    createFeeding.mutate(data, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  const editInitialValues: CreateFeedingFormData | undefined =
    mode === 'edit' && feeding
      ? {
          batchId: feeding.batch.id,
          feedingDate: toDateTimeLocalValue(feeding.feedingDate),
          quantityProvided: feeding.quantityProvided,
          feedType: feeding.feedType,
          supplyId: feeding.stock.supplyId ?? '',
          stockReductionQuantity: feeding.stockReductionQuantity,
        }
      : undefined;

  function renderContent() {
    if (mode === 'edit' && feeding) {
      return (
        <FeedingForm
          key={`${mode}-${feeding.id}-${open ? 'open' : 'closed'}`}
          initialValues={editInitialValues}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          submitLabel="Atualizar alimentação"
          submittingLabel="Atualizando..."
          variant="dialog"
          onCancel={handleClose}
        />
      );
    }
    return (
      <FeedingForm
        key={`create-${open ? 'open' : 'closed'}`}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        submitLabel="Criar alimentação"
        submittingLabel="Criando..."
        variant="dialog"
        onCancel={handleClose}
      />
    );
  }

  if (mode === 'view') {
    return (
      <FeedingDetailsDialog
        feeding={feeding ?? null}
        open={open}
        onOpenChange={onOpenChange}
        onEdit={onEdit}
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
