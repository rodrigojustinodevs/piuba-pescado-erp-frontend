import { z } from 'zod';

export const transactionTypeValues = ['income', 'expense', 'transfer', 'investment'] as const;
export const transactionStatusValues = ['paid', 'pending', 'overdue', 'cancelled'] as const;
export const transactionMethodValues = [
  'bank_slip',
  'pix',
  'bank_transfer',
  'credit_card',
  'debit_card',
  'cash',
  'check',
] as const;

export const createFinancialTransactionFormSchema = z
  .object({
    companyId: z.string().optional(),
    type: z.enum(transactionTypeValues, { message: 'Tipo inválido' }),
    status: z.enum(transactionStatusValues, { message: 'Status inválido' }),
    method: z.enum(transactionMethodValues).optional(),
    amount: z
      .number({ message: 'Valor obrigatório' })
      .positive({ message: 'Valor deve ser maior que zero' }),
    dueDate: z.string().optional(),
    paymentDate: z.string().optional(),
    description: z.string().optional(),
    notes: z.string().optional(),
    categoryId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Backend exige categoria em todo lançamento que não seja transferência.
    if (data.type !== 'transfer' && !data.categoryId?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['categoryId'],
        message: 'Selecione a categoria',
      });
    }
  });

/** Tipo de categoria financeira (backend) correspondente ao tipo do lançamento. */
export function categoryTypeForTransaction(
  type: (typeof transactionTypeValues)[number],
): string | null {
  if (type === 'income') return 'revenue';
  if (type === 'transfer') return null;
  return type;
}

export type CreateFinancialTransactionFormData = z.infer<
  typeof createFinancialTransactionFormSchema
>;
