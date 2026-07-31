'use client';

import type { StockDialogMode, StockLocation, UpdateStockLocationData } from '../types';
import type { CreateStockFormData } from '../schemas';
import { StockForm } from './StockForm';
import { StockViewDialogContent } from './StockViewDialogContent';
import { useCreateStock } from '../hooks/useCreateStock';
import { useUpdateStock } from '../hooks/useUpdateStock';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';

type StockDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: StockDialogMode;
  stock: StockLocation | null;
  onSuccess: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes do local de armazenamento',
    description: 'Visualize as informações registradas neste local.',
    maxWidth: 'sm:max-w-3xl',
  },
  edit: {
    title: 'Editar local de armazenamento',
    description: 'Atualize os dados deste local de armazenamento.',
    maxWidth: 'sm:max-w-2xl',
  },
  create: {
    title: 'Novo local de armazenamento',
    description: 'Cadastre um novo local para gerenciar estoque e movimentações.',
    maxWidth: 'sm:max-w-2xl',
  },
} satisfies Record<StockDialogMode, { title: string; description: string; maxWidth: string }>;

export function StockDialog({ open, onOpenChange, mode, stock, onSuccess }: Readonly<StockDialogProps>) {
  const createStock = useCreateStock({ skipNavigateToList: true });
  const updateStock = useUpdateStock({ skipNavigateToList: true });

  const isViewMode = mode === 'view';
  const isLoading = createStock.isPending || updateStock.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  function handleUpdate(data: Omit<UpdateStockLocationData, 'id'>) {
    if (!stock?.id) return;
    updateStock.mutate(
      { ...data, id: stock.id },
      {
        onSuccess: () => {
          onSuccess();
          handleClose();
        },
      },
    );
  }

  const editInitialValues: CreateStockFormData | undefined =
    stock && mode === 'edit'
      ? {
          code: stock.code,
          name: stock.name,
          type: stock.type,
          location: stock.location,
          responsible: stock.responsible ?? '',
          capacity: stock.capacity ?? undefined,
          status: stock.status,
          notes: stock.notes ?? '',
        }
      : undefined;

  function renderContent() {
    if (isViewMode) {
      return (
        <>
          <StockViewDialogContent stock={stock} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Fechar
            </Button>
          </DialogFooter>
        </>
      );
    }
    if (mode === 'edit' && stock && editInitialValues) {
      return (
        <StockForm
          key={`edit-${stock.id}-${open ? 'open' : 'closed'}`}
          mode="edit"
          initialValues={editInitialValues}
          stockCode={stock.code}
          onSubmit={handleUpdate}
          onCancel={handleClose}
          isSubmitting={isLoading}
          submitLabel="Atualizar local"
          submittingLabel="Atualizando..."
          inDialog
        />
      );
    }
    return (
      <StockForm
        key={`create-${open ? 'open' : 'closed'}`}
        mode="create"
        onSubmit={(data) => {
          createStock.mutate(data, {
            onSuccess: () => {
              onSuccess();
              handleClose();
            },
          });
        }}
        onCancel={handleClose}
        isSubmitting={isLoading}
        submitLabel="Cadastrar local"
        submittingLabel="Cadastrando..."
        inDialog
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
