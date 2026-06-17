'use client';

import type { Supplier, SupplierDialogMode, CreateSupplierData, UpdateSupplierData } from '../types';
import type { CreateSupplierFormData } from '../schemas';
import { SupplierForm } from './SupplierForm';
import { SupplierViewDialogContent } from './SupplierViewDialogContent';
import { useCreateSupplier } from '../hooks/useCreateSupplier';
import { useUpdateSupplier } from '../hooks/useUpdateSupplier';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';

type SupplierDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: SupplierDialogMode;
  supplier: Supplier | null;
  onSuccess: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes do fornecedor',
    description: 'Visualize as informações registradas neste fornecedor.',
    maxWidth: 'sm:max-w-4xl',
  },
  edit: {
    title: 'Editar fornecedor',
    description: 'Atualize os dados do fornecedor.',
    maxWidth: 'sm:max-w-2xl',
  },
  create: {
    title: 'Novo Fornecedor',
    description: 'Cadastre um novo fornecedor para sua empresa.',
    maxWidth: 'sm:max-w-2xl',
  },
} satisfies Record<SupplierDialogMode, { title: string; description: string; maxWidth: string }>;

export function SupplierDialog({
  open,
  onOpenChange,
  mode,
  supplier,
  onSuccess,
}: Readonly<SupplierDialogProps>) {
  const createSupplier = useCreateSupplier({ skipNavigateToList: true });
  const updateSupplier = useUpdateSupplier({ skipNavigateToList: true });

  const isViewMode = mode === 'view';
  const isLoading = createSupplier.isPending || updateSupplier.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  function handleCreate(data: CreateSupplierData) {
    createSupplier.mutate(data, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  function handleUpdate(data: CreateSupplierData) {
    if (!supplier?.id) return;
    updateSupplier.mutate({ ...data, id: supplier.id } as UpdateSupplierData, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  const editInitialValues: CreateSupplierFormData | undefined =
    supplier && mode === 'edit'
      ? {
          companyId: supplier.companyId ?? '',
          name: supplier.name,
          tradeName: supplier.tradeName ?? '',
          document: supplier.document ?? '',
          stateRegistration: supplier.stateRegistration ?? '',
          contact: supplier.contactName ?? '',
          phone: supplier.phone ?? '',
          email: supplier.email ?? '',
          category: supplier.category ?? undefined,
          paymentTerms: supplier.paymentTerms ?? '',
          status: supplier.status,
          rating: supplier.rating ?? undefined,
          address: {
            street: supplier.address.street ?? '',
            number: supplier.address.number ?? '',
            complement: supplier.address.complement ?? '',
            neighborhood: supplier.address.neighborhood ?? '',
            city: supplier.address.city ?? '',
            state: supplier.address.state ?? '',
            zipCode: supplier.address.zipCode ?? '',
          },
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
            <SupplierViewDialogContent supplier={supplier} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Fechar
              </Button>
            </DialogFooter>
          </>
        ) : mode === 'edit' && supplier ? (
          <SupplierForm
            key={`edit-${supplier.id}-${open ? 'open' : 'closed'}`}
            initialValues={editInitialValues}
            onSubmit={handleUpdate}
            onCancel={handleClose}
            isSubmitting={isLoading}
            submitLabel="Atualizar fornecedor"
            submittingLabel="Atualizando..."
            inDialog
          />
        ) : (
          <SupplierForm
            key={`create-${open ? 'open' : 'closed'}`}
            onSubmit={handleCreate}
            onCancel={handleClose}
            isSubmitting={isLoading}
            submitLabel="Cadastrar fornecedor"
            submittingLabel="Cadastrando..."
            inDialog
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
