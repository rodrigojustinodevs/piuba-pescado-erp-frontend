'use client';

import type { Sale, SaleDialogMode, CreateSaleData, UpdateSaleData } from '../types';
import type { UpdateSaleFormData } from '../schemas';
import { SaleForm } from './SaleForm';
import { SaleViewDialogContent } from './SaleViewDialogContent';
import { useCreateSale } from '../hooks/useCreateSale';
import { useUpdateSale } from '../hooks/useUpdateSale';
import { saleToUpdateFormValues } from '../utils/apiMapper';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';

type SaleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: SaleDialogMode;
  sale: Sale | null;
  onSuccess: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes da venda',
    description: 'Visualize as informações registradas nesta venda.',
    maxWidth: 'sm:max-w-3xl',
  },
  edit: {
    title: 'Editar venda',
    description: 'Atualize os dados editáveis desta venda.',
    maxWidth: 'sm:max-w-2xl',
  },
  create: {
    title: 'Nova Venda',
    description: 'Nota fiscal, itens e recebimento.',
    maxWidth: 'sm:max-w-3xl',
  },
} satisfies Record<SaleDialogMode, { title: string; description: string; maxWidth: string }>;

export function SaleDialog({
  open,
  onOpenChange,
  mode,
  sale,
  onSuccess,
}: Readonly<SaleDialogProps>) {
  const createSale = useCreateSale({ skipNavigateToList: true });
  const updateSale = useUpdateSale({ skipNavigateToList: true });

  const isLoading = createSale.isPending || updateSale.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  function handleCreate(data: CreateSaleData) {
    createSale.mutate(data, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  function handleUpdate(data: Omit<UpdateSaleData, 'id'>) {
    if (!sale?.id) return;
    updateSale.mutate({ ...data, id: sale.id }, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  const editInitialValues: UpdateSaleFormData | undefined =
    sale && mode === 'edit' ? saleToUpdateFormValues(sale) : undefined;

  function renderContent() {
    if (mode === 'view') {
      return (
        <>
          <SaleViewDialogContent sale={sale} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Fechar
            </Button>
          </DialogFooter>
        </>
      );
    }

    if (mode === 'edit' && sale) {
      return (
        <SaleForm
          key={`edit-${sale.id}-${open ? 'open' : 'closed'}`}
          initialValues={editInitialValues}
          onSubmit={handleUpdate}
          onCancel={handleClose}
          isSubmitting={isLoading}
          submitLabel="Atualizar venda"
          submittingLabel="Atualizando..."
          inDialog
        />
      );
    }

    return (
      <SaleForm
        key={`create-${open ? 'open' : 'closed'}`}
        onSubmit={handleCreate}
        onCancel={handleClose}
        isSubmitting={isLoading}
        submitLabel="Cadastrar venda"
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
