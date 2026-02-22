import { z } from 'zod';

const transferBaseSchema = z.object({
  batcheId: z.string().min(1, 'Lote é obrigatório'),
  originTankId: z.string().min(1, 'Tanque de origem é obrigatório'),
  destinationTankId: z.string().min(1, 'Tanque de destino é obrigatório'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que zero'),
  description: z.string().min(1, 'Descrição é obrigatória'),
});

const originDifferentFromDestination = {
  message: 'Tanque de destino deve ser diferente do tanque de origem',
  path: ['destinationTankId'] as const,
};

export const createTransferSchema = transferBaseSchema.refine(
  (data) => data.originTankId !== data.destinationTankId,
  originDifferentFromDestination,
);

export const updateTransferSchema = transferBaseSchema
  .safeExtend({
    id: z.string().min(1, 'ID é obrigatório'),
  })
  .refine((data) => data.originTankId !== data.destinationTankId, originDifferentFromDestination);

export type CreateTransferFormData = z.infer<typeof createTransferSchema>;
export type UpdateTransferFormData = z.infer<typeof updateTransferSchema>;
