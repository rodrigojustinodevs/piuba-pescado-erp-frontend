import { z } from 'zod';

export const financialCategoryTypeValues = ['revenue', 'expense', 'investment'] as const;
export const financialCategoryTypeSchema = z.enum(financialCategoryTypeValues, {
  message: 'Tipo inválido',
});

export const financialCategoryStatusValues = ['active', 'inactive'] as const;
export const financialCategoryStatusSchema = z.enum(financialCategoryStatusValues, {
  message: 'Status inválido',
});

export const createFinancialCategoryFormSchema = z.object({
  companyId: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  type: financialCategoryTypeSchema,
  status: financialCategoryStatusSchema,
});

export type CreateFinancialCategoryFormData = z.infer<typeof createFinancialCategoryFormSchema>;
