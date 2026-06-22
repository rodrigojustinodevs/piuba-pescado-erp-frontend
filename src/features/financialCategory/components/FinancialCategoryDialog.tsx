'use client';

import type {
  FinancialCategory,
  FinancialCategoryDialogMode,
  CreateFinancialCategoryData,
} from '../types';
import type { CreateFinancialCategoryFormData } from '../schemas';
import { financialCategoryStatusValues, financialCategoryTypeValues } from '../schemas';
import { FinancialCategoryForm } from './FinancialCategoryForm';
import { FinancialCategoryViewDialogContent } from './FinancialCategoryViewDialogContent';
import { useCreateFinancialCategory } from '../hooks/useCreateFinancialCategory';
import { useUpdateFinancialCategory } from '../hooks/useUpdateFinancialCategory';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';

type FinancialCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FinancialCategoryDialogMode;
  category: FinancialCategory | null;
  onSuccess: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes da categoria',
    description: 'Visualize as informações registradas nesta categoria financeira.',
    maxWidth: 'sm:max-w-xl',
  },
  edit: {
    title: 'Editar categoria',
    description: 'Atualize os dados da categoria financeira.',
    maxWidth: 'sm:max-w-lg',
  },
  create: {
    title: 'Nova Categoria',
    description: 'Cadastre uma categoria de receita, despesa ou investimento.',
    maxWidth: 'sm:max-w-lg',
  },
} satisfies Record<FinancialCategoryDialogMode, { title: string; description: string; maxWidth: string }>;

export function FinancialCategoryDialog({
  open,
  onOpenChange,
  mode,
  category,
  onSuccess,
}: Readonly<FinancialCategoryDialogProps>) {
  const createCategory = useCreateFinancialCategory({ skipNavigateToList: true });
  const updateCategory = useUpdateFinancialCategory({ skipNavigateToList: true });

  const isViewMode = mode === 'view';
  const isLoading = createCategory.isPending || updateCategory.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  function handleCreate(data: CreateFinancialCategoryData) {
    createCategory.mutate(data, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  function handleUpdate(data: CreateFinancialCategoryData) {
    if (!category?.id) return;
    updateCategory.mutate({ ...data, id: category.id }, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  const editInitialValues: CreateFinancialCategoryFormData | undefined =
    category && mode === 'edit'
      ? {
          companyId: category.companyId ?? '',
          name: category.name,
          notes: category.notes ?? '',
          type: (financialCategoryTypeValues as readonly string[]).includes(category.type)
            ? (category.type as CreateFinancialCategoryFormData['type'])
            : financialCategoryTypeValues[0],
          status: (financialCategoryStatusValues as readonly string[]).includes(category.status)
            ? (category.status as CreateFinancialCategoryFormData['status'])
            : financialCategoryStatusValues[0],
        }
      : undefined;

  function renderContent() {
    if (isViewMode) {
      return (
        <>
          <FinancialCategoryViewDialogContent category={category} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Fechar
            </Button>
          </DialogFooter>
        </>
      );
    }
    if (mode === 'edit' && category) {
      return (
        <FinancialCategoryForm
          key={`edit-${category.id}-${open ? 'open' : 'closed'}`}
          initialValues={editInitialValues}
          onSubmit={handleUpdate}
          onCancel={handleClose}
          isSubmitting={isLoading}
          isEdit
          submitLabel="Atualizar categoria"
          submittingLabel="Atualizando..."
          inDialog
        />
      );
    }
    return (
      <FinancialCategoryForm
        key={`create-${open ? 'open' : 'closed'}`}
        onSubmit={handleCreate}
        onCancel={handleClose}
        isSubmitting={isLoading}
        submitLabel="Cadastrar categoria"
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
