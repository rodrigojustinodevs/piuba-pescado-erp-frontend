import { z } from 'zod';

export const createFeedingSchema = z.object({
  batchId: z.string().min(1, 'Lote é obrigatório'),
  feedingDate: z.string().min(1, 'Data da alimentação é obrigatória'),
  quantityProvided: z.number().min(0.01, 'Quantidade fornecida deve ser maior que zero'),
  feedType: z.string().min(1, 'Tipo de ração é obrigatório'),
  stockId: z.string().min(1, 'Estoque é obrigatório'),
  stockReductionQuantity: z.number().min(0, 'Redução de estoque deve ser maior ou igual a zero'),
});

export type CreateFeedingFormData = z.infer<typeof createFeedingSchema>;
