import { z } from 'zod';

export const createSettlementSchema = z.object({
  batcheId: z.string().min(1, 'Lote é obrigatório'),
  settlementDate: z.string().min(1, 'Data do povoamento é obrigatória'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que zero'),
  averageWeight: z.number().min(0.01, 'Peso médio deve ser maior que zero'),
});

export const updateSettlementSchema = createSettlementSchema.extend({
  id: z.string().min(1, 'ID é obrigatório'),
});

export type CreateSettlementFormData = z.infer<typeof createSettlementSchema>;
export type UpdateSettlementFormData = z.infer<typeof updateSettlementSchema>;
