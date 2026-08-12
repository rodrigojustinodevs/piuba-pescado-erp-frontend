'use client';

import { useState } from 'react';
import {
  isBatchDistributionData,
  type BatchDistributionFormData,
  type CreateBatchFormData,
  type UpdateBatchFormData,
} from '../schemas';
import { useCreateBatch } from '../hooks/useCreateBatch';
import { useDistributeBatch } from '../hooks/useDistributeBatch';
import { useUpdateBatch } from '../hooks/useUpdateBatch';
import { BatchForm, type BatchFormProps } from './BatchForm';
import { BatchViewDialogContent } from './BatchViewDialogContent';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Batch, BatchDialogMode, UpdateBatchData } from '../types';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { GenerateManagementPlanDialog, MANAGEMENT_PLAN_VIEW_ROLES } from '@/features/managementPlan';
import { Sparkles } from 'lucide-react';

type BatchCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: BatchDialogMode;
  batch: Batch | null;
  onSuccess: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes do lote',
    description: 'Visualize as informações principais do lote.',
    maxWidth: 'sm:max-w-2xl',
  },
  edit: {
    title: 'Editar lote',
    description: 'Atualize os dados do lote.',
    maxWidth: 'sm:max-w-3xl',
  },
  create: {
    title: 'Novo lote',
    description: 'Cadastre um lote único em um viveiro ou distribua em múltiplos viveiros.',
    maxWidth: 'sm:max-w-3xl',
  },
} satisfies Record<BatchDialogMode, { title: string; description: string; maxWidth: string }>;

export function BatchCreateDialog({
  open,
  onOpenChange,
  mode,
  batch,
  onSuccess,
}: Readonly<BatchCreateDialogProps>) {
  const createBatch = useCreateBatch({ skipNavigateToList: true });
  const distributeBatch = useDistributeBatch({ skipNavigateToList: true });
  const updateBatch = useUpdateBatch();

  const isViewMode = mode === 'view';
  const isLoading = createBatch.isPending || distributeBatch.isPending || updateBatch.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  function handleSubmit(data: CreateBatchFormData | BatchDistributionFormData | UpdateBatchFormData) {
    if (mode === 'edit') {
      if (!batch?.id) return;
      const payload: UpdateBatchData = { ...(data as CreateBatchFormData), id: batch.id };
      updateBatch.mutate(payload, {
        onSuccess: () => {
          onSuccess();
          handleClose();
        },
      });
      return;
    }

    const mutation = isBatchDistributionData(data as CreateBatchFormData | BatchDistributionFormData)
      ? distributeBatch
      : createBatch;
    mutation.mutate(data as never, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  const batchFormProps: BatchFormProps =
    mode === 'create'
      ? {
          mode: 'create',
          onSubmit: handleSubmit,
        }
      : {
          mode: mode === 'edit' ? 'edit' : 'update',
          initialData: batch ?? undefined,
          onSubmit: handleSubmit as (data: UpdateBatchFormData) => void,
        };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-h-[90vh] overflow-y-auto bg-white ${maxWidth}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isViewMode ? (
          <ViewContent batch={batch} onClose={handleClose} />
        ) : (
          <BatchForm
            key={`${mode}-${batch?.id ?? 'new'}-${open ? 'open' : 'closed'}`}
            {...batchFormProps}
            isLoading={isLoading}
            submitLabel={mode === 'edit' ? 'Atualizar lote' : 'Criar lote'}
            onCancel={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type ViewContentProps = {
  batch: Batch | null;
  onClose: () => void;
};

function ViewContent({ batch, onClose }: Readonly<ViewContentProps>) {
  const { canAccess } = useAuthContext();
  const canViewManagementPlan = canAccess(MANAGEMENT_PLAN_VIEW_ROLES);
  const [generatePlanOpen, setGeneratePlanOpen] = useState(false);

  return (
    <>
      <BatchViewDialogContent batch={batch} />
      <DialogFooter>
        {canViewManagementPlan && batch && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setGeneratePlanOpen(true)}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Criar Plano de Manejo
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </DialogFooter>

      {canViewManagementPlan && batch && (
        <GenerateManagementPlanDialog
          open={generatePlanOpen}
          onOpenChange={setGeneratePlanOpen}
          batchId={batch.id}
          hasSpecies={!!batch.species}
        />
      )}
    </>
  );
}
