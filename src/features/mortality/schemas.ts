import { z } from 'zod';

const mortalitySeverityEnum = z.enum(['low', 'medium', 'high', 'critical']);
const mortalityCauseEnum = z.enum([
  'disease',
  'water_quality',
  'predation',
  'handling',
  'climate',
  'unknown',
  'other',
]);

export const createMortalitySchema = z.object({
  batchId: z.string().min(1, 'Lote é obrigatório'),
  mortalityDate: z.string().min(1, 'Data da mortalidade é obrigatória'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que zero'),
  cause: mortalityCauseEnum,
  severity: mortalitySeverityEnum,
  description: z.string().optional(),
});

export type CreateMortalityFormData = z.infer<typeof createMortalitySchema>;
