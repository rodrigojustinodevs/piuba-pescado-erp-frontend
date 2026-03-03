import { z } from 'zod';

export const createBiometrySchema = z.object({
  batchId: z.string().min(1, 'Lote é obrigatório'),
  biometryDate: z.string().min(1, 'Data da biometria é obrigatória'),
  averageWeight: z.number().min(0.01, 'Peso médio deve ser maior que zero'),
  fcr: z.number().min(0, 'FCR deve ser maior ou igual a zero'),
});

export const updateBiometrySchema = createBiometrySchema.extend({
  id: z.string().min(1, 'ID é obrigatório'),
});

export type CreateBiometryFormData = z.infer<typeof createBiometrySchema>;
export type UpdateBiometryFormData = z.infer<typeof updateBiometrySchema>;
