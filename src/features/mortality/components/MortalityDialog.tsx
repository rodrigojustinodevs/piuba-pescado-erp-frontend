'use client';

import { useMemo } from 'react';
import type { Mortality, MortalityDialogMode, CreateMortalityData } from '../types';
import type { CreateMortalityFormData } from '../schemas';
import { MortalityForm, toDateInputValue } from './MortalityForm';
import { MortalityViewDialogContent } from './MortalityViewDialogContent';
import { useCreateMortality } from '../hooks/useCreateMortality';
import { useUpdateMortality } from '../hooks/useUpdateMortality';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';

type MortalityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: MortalityDialogMode;
  mortality: Mortality | null;
  onSuccess: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes da mortalidade',
    description: 'Visualize as informações registradas nesta mortalidade.',
    maxWidth: 'sm:max-w-lg',
  },
  edit: {
    title: 'Editar mortalidade',
    description: 'Atualize os dados da mortalidade.',
    maxWidth: 'sm:max-w-xl',
  },
  create: {
    title: 'Nova mortalidade',
    description: 'Cadastre um novo registro de mortalidade para o lote.',
    maxWidth: 'sm:max-w-xl',
  },
} satisfies Record<
  MortalityDialogMode,
  { title: string; description: string; maxWidth: string }
>;

export function MortalityDialog({
  open,
  onOpenChange,
  mode,
  mortality,
  onSuccess,
}: Readonly<MortalityDialogProps>) {
  const createMortality = useCreateMortality({ skipNavigateToList: true });
  const updateMortality = useUpdateMortality({ skipNavigateToList: true });

  const isViewMode = mode === 'view';
  const isLoading = createMortality.isPending || updateMortality.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  const initialValues = useMemo<CreateMortalityFormData | undefined>(() => {
    if (!mortality || mode !== 'edit') return undefined;
    return {
      batchId: mortality.batchId,
      mortalityDate: toDateInputValue(mortality.mortalityDate),
      quantity: mortality.quantity,
      cause: mortality.cause,
      severity: mortality.severity,
    };
  }, [mortality, mode]);

  function handleSubmit(data: CreateMortalityData) {
    if (mode === 'edit') {
      if (!mortality?.id) return;
      updateMortality.mutate(
        { ...data, id: mortality.id },
        {
          onSuccess: () => {
            onSuccess();
            handleClose();
          },
        },
      );
      return;
    }

    createMortality.mutate(data, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-h-[90vh] overflow-y-auto bg-white ${maxWidth}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isViewMode ? (
          <>
            <MortalityViewDialogContent mortality={mortality} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Fechar
              </Button>
            </DialogFooter>
          </>
        ) : (
          <MortalityForm
            key={`${mode}-${mortality?.id ?? 'new'}-${open ? 'open' : 'closed'}`}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
            submitLabel={mode === 'edit' ? 'Atualizar mortalidade' : 'Criar mortalidade'}
            submittingLabel={mode === 'edit' ? 'Atualizando...' : 'Criando...'}
            onCancel={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
