import { z } from 'zod';

export const saleStatusValues = ['pending', 'confirmed', 'cancelled'] as const;
export const saleStatusSchema = z.enum(saleStatusValues, {
  message: 'Status inválido',
});

/** Status permitidos no PATCH da venda (backend: pendente e confirmado). */
export const saleUpdateStatusValues = ['pending', 'confirmed'] as const;
export const updateSaleStatusSchema = z.enum(saleUpdateStatusValues, {
  message: 'Status inválido',
});

export const updateSaleFormSchema = z.object({
  totalWeight: z.number().min(0.001, 'Peso total deve ser pelo menos 0,001'),
  pricePerKg: z.number().min(0, 'Preço por kg não pode ser negativo'),
  saleDate: z.string().min(1, 'Data da venda é obrigatória'),
  status: updateSaleStatusSchema,
  notes: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  isTotalHarvest: z.boolean(),
});

export type UpdateSaleFormData = z.infer<typeof updateSaleFormSchema>;

export const createSaleFormSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  batchId: z.string().min(1, 'Lote é obrigatório'),
  stockingId: z.string().min(1, 'Povoamento é obrigatório'),
  financialCategoryId: z.string().min(1, 'Categoria financeira é obrigatória'),
  totalWeight: z.number().min(0.01, 'Peso total deve ser maior que zero'),
  pricePerKg: z.number().min(0.01, 'Preço por kg deve ser maior que zero'),
  saleDate: z.string().min(1, 'Data da venda é obrigatória'),
  isTotalHarvest: z.boolean(),
  status: saleStatusSchema,
  needsInvoice: z.boolean(),
  notes: z.string().optional(),
});

export type CreateSaleFormData = z.infer<typeof createSaleFormSchema>;
