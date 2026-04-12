import { z } from 'zod';

/**
 * Schema de validação para criação de lote
 */
export const createBatchSchema = z.object({
  name: z.string().min(1, 'Nome do lote é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  tankId: z.string().min(1, 'Tanque é obrigatório'),
  entryDate: z.string().min(1, 'Data de entrada é obrigatória'),
  initialQuantity: z.number().min(1, 'Quantidade inicial deve ser maior que zero'),
  species: z.string().min(1, 'Espécie é obrigatória'),
  cultivation: z.string().min(1, 'Tipo de cultivo é obrigatório'),
});

/**
 * Schema de validação para atualização de lote
 */
export const updateBatchSchema = createBatchSchema.partial().extend({
  id: z.string().min(1, 'ID é obrigatório'),
});

/**
 * Tipos inferidos dos schemas
 */
export type CreateBatchFormData = z.infer<typeof createBatchSchema>;
export type UpdateBatchFormData = z.infer<typeof updateBatchSchema>;

const distributionRowSchema = z.object({
  tankId: z.string().min(1, 'Tanque é obrigatório'),
  quantity: z.number().positive('Quantidade deve ser maior que zero'),
  averageWeight: z.number().positive('Peso médio deve ser maior que zero'),
});

export const batchDistributionSchema = z.object({
  supplierId: z.string().min(1, 'Fornecedor é obrigatório'),
  totalCost: z.number().min(0, 'Custo total não pode ser negativo'),
  entryDate: z.string().min(1, 'Data de entrada é obrigatória'),
  species: z.string().min(1, 'Espécie é obrigatória'),
  cultivation: z.string().min(1, 'Tipo de cultivo é obrigatório'),
  notes: z.string().optional(),
  distribution: z
    .array(distributionRowSchema)
    .min(1, 'Informe pelo menos uma linha de distribuição'),
});

export type BatchDistributionFormData = z.infer<typeof batchDistributionSchema>;
