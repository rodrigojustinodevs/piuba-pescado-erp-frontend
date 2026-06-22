'use client';

import type {
  FinancialTransaction,
  FinancialTransactionDialogMode,
  CreateFinancialTransactionData,
} from '../types';
import type { CreateFinancialTransactionFormData } from '../schemas';
import { transactionTypeValues, transactionStatusValues } from '../schemas';
import { FinancialTransactionForm } from './FinancialTransactionForm';
import { FinancialTransactionViewDialogContent } from './FinancialTransactionViewDialogContent';
import { useCreateFinancialTransaction } from '../hooks/useCreateFinancialTransaction';
import { useUpdateFinancialTransaction } from '../hooks/useUpdateFinancialTransaction';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FinancialTransactionDialogMode;
  transaction: FinancialTransaction | null;
  onSuccess: () => void;
};

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes da transação',
    description: 'Visualize as informações desta transação financeira.',
    maxWidth: 'sm:max-w-xl',
  },
  edit: {
    title: 'Editar transação',
    description: 'Atualize os dados da transação financeira.',
    maxWidth: 'sm:max-w-2xl',
  },
  create: {
    title: 'Nova Transação',
    description: 'Registre uma receita, despesa ou transferência.',
    maxWidth: 'sm:max-w-2xl',
  },
} satisfies Record<
  FinancialTransactionDialogMode,
  { title: string; description: string; maxWidth: string }
>;

export function FinancialTransactionDialog({
  open,
  onOpenChange,
  mode,
  transaction,
  onSuccess,
}: Readonly<Props>) {
  const createTransaction = useCreateFinancialTransaction({ skipNavigateToList: true });
  const updateTransaction = useUpdateFinancialTransaction({ skipNavigateToList: true });

  const isLoading = createTransaction.isPending || updateTransaction.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  function handleCreate(data: CreateFinancialTransactionData) {
    createTransaction.mutate(data, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  function handleUpdate(data: CreateFinancialTransactionData) {
    if (!transaction?.id) return;
    updateTransaction.mutate(
      { ...data, id: transaction.id },
      {
        onSuccess: () => {
          onSuccess();
          handleClose();
        },
      },
    );
  }

  const editInitialValues: CreateFinancialTransactionFormData | undefined =
    transaction && mode === 'edit'
      ? {
          companyId: '',
          type: (transactionTypeValues as readonly string[]).includes(transaction.type)
            ? (transaction.type as CreateFinancialTransactionFormData['type'])
            : 'expense',
          status: (transactionStatusValues as readonly string[]).includes(transaction.status)
            ? (transaction.status as CreateFinancialTransactionFormData['status'])
            : 'pending',
          method: transaction.method ?? undefined,
          amount: transaction.amount,
          dueDate: transaction.dueDate ?? '',
          paymentDate: transaction.paymentDate ?? '',
          description: transaction.description ?? '',
          notes: transaction.notes ?? '',
          categoryId: transaction.categoryId ?? '',
        }
      : undefined;

  function renderContent() {
    if (mode === 'view') {
      return (
        <>
          <FinancialTransactionViewDialogContent transaction={transaction} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Fechar
            </Button>
          </DialogFooter>
        </>
      );
    }
    if (mode === 'edit' && transaction) {
      return (
        <FinancialTransactionForm
          key={`edit-${transaction.id}-${open ? 'open' : 'closed'}`}
          initialValues={editInitialValues}
          onSubmit={handleUpdate}
          onCancel={handleClose}
          isSubmitting={isLoading}
          isEdit
          submitLabel="Atualizar transação"
          submittingLabel="Atualizando..."
          inDialog
        />
      );
    }
    return (
      <FinancialTransactionForm
        key={`create-${open ? 'open' : 'closed'}`}
        onSubmit={handleCreate}
        onCancel={handleClose}
        isSubmitting={isLoading}
        submitLabel="Cadastrar transação"
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
