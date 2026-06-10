'use client';

import type { CreateFeedingFormData } from '../schemas';
import { useCreateFeeding } from '../hooks/useCreateFeeding';
import { useUpdateFeeding } from '../hooks/useUpdateFeeding';
import { FeedingForm, toDateTimeLocalValue } from './FeedingForm';
import { FeedingViewDialogContent } from './FeedingViewDialogContent';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import type { CreateFeedingData, Feeding, FeedingDialogMode, UpdateFeedingData } from '../types';

type FeedingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FeedingDialogMode;
  feeding: Feeding | null;
  onSuccess: () => void;
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
}: Readonly<FeedingDialogProps>) {
  const createFeeding = useCreateFeeding({ skipNavigateToList: true });
  const updateFeeding = useUpdateFeeding({ skipNavigateToList: true });

  const isViewMode = mode === 'view';
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
          stockId: feeding.stock.id,
          stockReductionQuantity: feeding.stockReductionQuantity,
        }
      : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-h-[90vh] overflow-y-auto bg-white ${maxWidth}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isViewMode ? (
          <>
            <FeedingViewDialogContent feeding={feeding} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Fechar
              </Button>
            </DialogFooter>
          </>
        ) : mode === 'edit' && feeding ? (
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
        ) : (
          <FeedingForm
            key={`create-${open ? 'open' : 'closed'}`}
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
            submitLabel="Criar alimentação"
            submittingLabel="Criando..."
            variant="dialog"
            onCancel={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
