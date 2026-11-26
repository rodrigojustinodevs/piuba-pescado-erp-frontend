'use client';

import { useMemo } from 'react';
import type { CreateWaterQualityData, WaterQuality, WaterQualityDialogMode } from '../types';
import { waterQualityToFormValues } from '../utils/waterQualityFormMapper';
import { useCreateWaterQuality } from '../hooks/useCreateWaterQuality';
import { useUpdateWaterQuality } from '../hooks/useUpdateWaterQuality';
import { WaterQualityForm } from './WaterQualityForm';
import { WaterQualityDetailsDialog } from './WaterQualityDetailsDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';

export interface WaterQualityDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly mode: WaterQualityDialogMode;
  readonly record: WaterQuality | null;
  /** Chamado pelo botão "Editar" da visualização (troca o modo para 'edit'). */
  readonly onEdit?: () => void;
}

export function WaterQualityDialog({
  open,
  onOpenChange,
  mode,
  record,
  onEdit,
}: Readonly<WaterQualityDialogProps>) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const createMutation = useCreateWaterQuality({ skipNavigateToList: true });
  const updateMutation = useUpdateWaterQuality();
  const isSubmitting = isEdit ? updateMutation.isPending : createMutation.isPending;

  const initialValues = useMemo(
    () => (record ? waterQualityToFormValues(record) : undefined),
    [record],
  );

  let title = 'Nova medição';
  let description = 'Informe tanque, data e parâmetros da qualidade da água.';

  if (isEdit) {
    title = 'Editar medição';
    description = 'Atualize os valores e salve.';
  }

  if (isView) {
    return (
      <WaterQualityDetailsDialog
        record={record}
        open={open}
        onOpenChange={onOpenChange}
        onEdit={onEdit}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <WaterQualityForm
          key={isEdit && record ? record.id : 'create'}
          initialValues={isEdit ? initialValues : undefined}
          onCancel={() => onOpenChange(false)}
          onSubmit={(data: CreateWaterQualityData) => {
            if (isEdit && record) {
              updateMutation.mutate(
                { ...data, id: record.id },
                {
                  onSuccess: () => {
                    onOpenChange(false);
                  },
                },
              );
              return;
            }
            createMutation.mutate(data, {
              onSuccess: () => {
                onOpenChange(false);
              },
            });
          }}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? 'Salvar alterações' : 'Registrar medição'}
          submittingLabel={isEdit ? 'Salvando...' : 'Registrando...'}
        />
      </DialogContent>
    </Dialog>
  );
}
