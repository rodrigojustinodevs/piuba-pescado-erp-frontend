import { z } from 'zod';

export const createStockFormSchema = z.object({
  companyId: z.string().optional(),
  supplierId: z.string().min(1, 'Fornecedor é obrigatório'),
  supplyId: z.string().min(1, 'Insumo é obrigatório'),
  quantity: z.number().min(0.01, 'Quantidade deve ser maior que zero'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  minimumStock: z.number().min(0, 'Estoque mínimo deve ser maior ou igual a zero'),
  unitPrice: z.number().min(0, 'Preço unitário deve ser maior ou igual a zero'),
});

export type CreateStockFormData = z.infer<typeof createStockFormSchema>;

/** Apenas campos editáveis no PUT (alinhado ao backend). */
export const updateStockFormSchema = z.object({
  supplierId: z.string(),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  unitPrice: z.number().min(0, 'Preço unitário deve ser maior ou igual a zero'),
  minimumStock: z.number().min(0, 'Estoque mínimo deve ser maior ou igual a zero'),
  withdrawalQuantity: z.number().min(0, 'Quantidade de retirada deve ser maior ou igual a zero'),
});

export type UpdateStockFormData = z.infer<typeof updateStockFormSchema>;

export const adjustStockFormSchema = z.object({
  physicalQuantity: z.number().min(0, 'Quantidade física deve ser maior ou igual a zero'),
  reason: z.string().min(1, 'Motivo é obrigatório'),
});

export type AdjustStockFormData = z.infer<typeof adjustStockFormSchema>;
