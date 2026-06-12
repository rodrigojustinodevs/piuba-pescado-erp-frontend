'use client';

import type { Supply, SupplyDialogMode, CreateSupplyData, UpdateSupplyData } from '../types';
import type { CreateSupplyFormData } from '../schemas';
import { SupplyForm } from './SupplyForm';
import { SupplyViewDialogContent } from './SupplyViewDialogContent';
import { useCreateSupply } from '../hooks/useCreateSupply';
import { useUpdateSupply } from '../hooks/useUpdateSupply';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';

type SupplyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: SupplyDialogMode;
  supply: Supply | null;
  onSuccess: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes do produto',
    description: 'Visualize as informações registradas neste produto.',
    maxWidth: 'sm:max-w-4xl',
  },
  edit: {
    title: 'Editar produto',
    description: 'Atualize os dados do produto.',
    maxWidth: 'sm:max-w-2xl',
  },
  create: {
    title: 'Novo Insumo / Produto',
    description: 'Cadastre insumos de produção ou produtos acabados para venda.',
    maxWidth: 'sm:max-w-2xl',
  },
} satisfies Record<SupplyDialogMode, { title: string; description: string; maxWidth: string }>;

export function SupplyDialog({
  open,
  onOpenChange,
  mode,
  supply,
  onSuccess,
}: Readonly<SupplyDialogProps>) {
  const createSupply = useCreateSupply({ skipNavigateToList: true });
  const updateSupply = useUpdateSupply({ skipNavigateToList: true });

  const isViewMode = mode === 'view';
  const isLoading = createSupply.isPending || updateSupply.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  function handleCreate(data: CreateSupplyData) {
    createSupply.mutate(data, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  function handleUpdate(data: CreateSupplyData) {
    if (!supply?.id) return;
    updateSupply.mutate({ ...data, id: supply.id } as UpdateSupplyData, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  const editInitialValues: CreateSupplyFormData | undefined =
    supply && mode === 'edit'
      ? {
          companyId: supply.companyId ?? '',
          sku: supply.sku ?? '',
          name: supply.name,
          category: supply.category ?? '',
          defaultUnit: supply.defaultUnit as CreateSupplyFormData['defaultUnit'],
          supplierId: supply.supplierId ?? '',
          unitCost: supply.unitCost,
          salePrice: supply.salePrice,
          currentStock: supply.currentStock,
          minStock: supply.minStock,
          isProduct: supply.isProduct,
          description: supply.description ?? '',
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
            <SupplyViewDialogContent supply={supply} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Fechar
              </Button>
            </DialogFooter>
          </>
        ) : mode === 'edit' && supply ? (
          <SupplyForm
            key={`edit-${supply.id}-${open ? 'open' : 'closed'}`}
            initialValues={editInitialValues}
            onSubmit={handleUpdate}
            onCancel={handleClose}
            isSubmitting={isLoading}
            submitLabel="Atualizar produto"
            submittingLabel="Atualizando..."
            inDialog
          />
        ) : (
          <SupplyForm
            key={`create-${open ? 'open' : 'closed'}`}
            onSubmit={handleCreate}
            onCancel={handleClose}
            isSubmitting={isLoading}
            submitLabel="Cadastrar produto"
            submittingLabel="Cadastrando..."
            inDialog
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
