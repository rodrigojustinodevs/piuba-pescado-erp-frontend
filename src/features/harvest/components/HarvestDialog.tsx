'use client';

import { useState, useMemo } from 'react';
import type { Harvest, HarvestDialogMode, CreateHarvestData, PatchHarvestPayload } from '../types';
import type { CreateHarvestFormData } from '../schemas';
import type { ApiFieldError } from './HarvestForm';
import { HarvestForm } from './HarvestForm';
import { HarvestViewDialogContent } from './HarvestViewDialogContent';
import { useCreateHarvest } from '../hooks/useCreateHarvest';
import { useUpdateHarvest } from '../hooks/useUpdateHarvest';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Pencil } from 'lucide-react';

type HarvestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: HarvestDialogMode;
  harvest: Harvest | null;
  onSuccess: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes da despesca',
    description: 'Visualize as informações registradas nesta despesca.',
    maxWidth: 'sm:max-w-2xl',
  },
  edit: {
    title: 'Editar despesca',
    description: 'Atualize os dados da despesca.',
    maxWidth: 'sm:max-w-3xl',
  },
  create: {
    title: 'Nova Despesca',
    description: 'Registre a colheita do lote com classificação e destino comercial.',
    maxWidth: 'sm:max-w-3xl',
  },
} satisfies Record<HarvestDialogMode, { title: string; description: string; maxWidth: string }>;

function parseHarvestApiError(message: string): ApiFieldError {
  if (message.toLowerCase().includes('batch')) {
    return { field: 'batchId', message };
  }
  if (message.toLowerCase().includes('weight') || message.toLowerCase().includes('peso')) {
    return { field: 'totalWeight', message };
  }
  return { field: 'root', message };
}

export function HarvestDialog({
  open,
  onOpenChange,
  mode,
  harvest,
  onSuccess,
}: Readonly<HarvestDialogProps>) {
  const createHarvest = useCreateHarvest({ skipNavigateToList: true });
  const updateHarvest = useUpdateHarvest({ skipNavigateToList: true });
  const [apiError, setApiError] = useState<ApiFieldError>(null);
  const [currentMode, setCurrentMode] = useState<HarvestDialogMode>(mode);

  // sync when the dialog re-opens with a different mode
  useMemo(() => {
    setCurrentMode(mode);
  }, [mode]);

  const isViewMode = currentMode === 'view';
  const isLoading = createHarvest.isPending || updateHarvest.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[currentMode];

  function handleClose() {
    setApiError(null);
    onOpenChange(false);
  }

  function handleCreate(data: CreateHarvestFormData) {
    setApiError(null);
    createHarvest.mutate(data as CreateHarvestData, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
      onError: (error: Error) => {
        setApiError(parseHarvestApiError(error.message));
      },
    });
  }

  function handleUpdate(data: PatchHarvestPayload) {
    if (!harvest?.id) return;
    setApiError(null);
    updateHarvest.mutate(data, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
      onError: (error: Error) => {
        setApiError(parseHarvestApiError(error.message));
      },
    });
  }

  function renderContent() {
    if (isViewMode) {
      return (
        <>
          <HarvestViewDialogContent harvest={harvest} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Fechar
            </Button>
            {harvest && (
              <Button type="button" onClick={() => setCurrentMode('edit')}>
                <Pencil className="mr-1.5 h-4 w-4" />
                Editar
              </Button>
            )}
          </DialogFooter>
        </>
      );
    }
    const openState = open ? 'open' : 'closed';
    if (currentMode === 'edit' && harvest) {
      return (
        <HarvestForm
          key={`edit-${harvest.id}-${openState}`}
          mode="update"
          initialData={harvest}
          onSubmit={handleUpdate}
          isLoading={isLoading}
          submitLabel="Atualizar despesca"
          onCancel={handleClose}
          apiError={apiError}
        />
      );
    }
    return (
      <HarvestForm
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
