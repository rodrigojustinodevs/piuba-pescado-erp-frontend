import { z } from 'zod';

export const createStockingSchema = z.object({
  batchId: z.string().min(1, 'Lote é obrigatório'),
  stockingDate: z.string().min(1, 'Data do povoamento é obrigatória'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que zero'),
  averageWeight: z.number().min(0.01, 'Peso médio deve ser maior que zero'),
});

export const updateStockingSchema = createStockingSchema.extend({
  id: z.string().min(1, 'ID é obrigatório'),
});

export type CreateStockingFormData = z.infer<typeof createStockingSchema>;
export type UpdateStockingFormData = z.infer<typeof updateStockingSchema>;
