'use client';

import { useMemo } from 'react';
import type { Biometry, BiometryDialogMode } from '../types';
import type { CreateBiometryFormData } from '../schemas';
import { BiometryForm } from './BiometryForm';
import { BiometryDetailsDialog } from './BiometryDetailsDialog';
import { useCreateBiometry } from '../hooks/useCreateBiometry';
import { useUpdateBiometry } from '../hooks/useUpdateBiometry';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';

type BiometryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: BiometryDialogMode;
  biometry: Biometry | null;
  onSuccess: () => void;
  /** Chamado pelo botão "Editar" da visualização (troca o modo para 'edit'). */
  onEdit?: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes da biometria',
    description: 'Visualize as informações registradas nesta biometria.',
    maxWidth: 'sm:max-w-lg',
  },
  edit: {
    title: 'Editar biometria',
    description: 'Atualize os dados da biometria.',
    maxWidth: 'sm:max-w-xl',
  },
  create: {
    title: 'Nova biometria',
    description: 'Cadastre uma nova biometria para o lote.',
    maxWidth: 'sm:max-w-xl',
  },
} satisfies Record<BiometryDialogMode, { title: string; description: string; maxWidth: string }>;

export function BiometryDialog({
  open,
  onOpenChange,
  mode,
  biometry,
  onSuccess,
  onEdit,
}: Readonly<BiometryDialogProps>) {
  const createBiometry = useCreateBiometry({ skipNavigateToList: true });
  const updateBiometry = useUpdateBiometry({ skipNavigateToList: true });

  const isLoading = createBiometry.isPending || updateBiometry.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  const initialValues = useMemo<CreateBiometryFormData | undefined>(() => {
    if (!biometry || mode !== 'edit') return undefined;
    return {
      batchId: biometry.batchId,
      biometryDate: biometry.biometryDate?.split('T')[0] ?? biometry.biometryDate ?? '',
      averageWeight: biometry.averageWeight,
      sampleWeight: biometry.sampleWeight,
      sampleQuantity: biometry.sampleQuantity,
      fcr: biometry.fcr,
    };
  }, [biometry, mode]);

  function handleSubmit(data: CreateBiometryFormData) {
    if (mode === 'edit') {
      if (!biometry?.id) return;
      const payload = {
        ...data,
        averageWeight: biometry.averageWeight,
        fcr: biometry.fcr,
      };
      updateBiometry.mutate(
        { ...payload, id: biometry.id },
        {
          onSuccess: () => {
            onSuccess();
            handleClose();
          },
        },
      );
      return;
    }

    createBiometry.mutate(data, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  if (mode === 'view') {
    return (
      <BiometryDetailsDialog
        biometry={biometry ?? null}
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

        <BiometryForm
          key={`${mode}-${biometry?.id ?? 'new'}-${open ? 'open' : 'closed'}`}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          isUpdate={mode === 'edit'}
          submitLabel={mode === 'edit' ? 'Atualizar biometria' : 'Criar biometria'}
          submittingLabel={mode === 'edit' ? 'Atualizando...' : 'Criando...'}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
