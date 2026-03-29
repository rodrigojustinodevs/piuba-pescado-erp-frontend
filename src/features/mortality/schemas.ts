import { z } from 'zod';

export const createMortalitySchema = z.object({
  batchId: z.string().min(1, 'Lote é obrigatório'),
  mortalityDate: z.string().min(1, 'Data da mortalidade é obrigatória'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que zero'),
  cause: z.string().min(1, 'Causa é obrigatória'),
});

export type CreateMortalityFormData = z.infer<typeof createMortalitySchema>;
