import { z } from 'zod';

export const growthCurvePointSchema = z.object({
  day: z.number().min(0, 'Dia deve ser maior ou igual a zero'),
  weightG: z.number().min(0, 'Peso deve ser maior ou igual a zero'),
});

export const createSpeciesSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  idealTemperatureMin: z.number().optional(),
  idealTemperatureMax: z.number().optional(),
  idealDissolvedOxygenMin: z.number().optional(),
  criticalDissolvedOxygenMin: z.number().optional(),
  idealSalinityMin: z.number().optional(),
  idealSalinityMax: z.number().optional(),
  expectedFcr: z.number().optional(),
  maxFeedingRatePctBiomass: z.number().optional(),
  growthCurveReference: z.array(growthCurvePointSchema).optional(),
});

export const updateSpeciesSchema = createSpeciesSchema.partial().extend({
  id: z.string().min(1, 'ID é obrigatório'),
});

export type CreateSpeciesFormData = z.infer<typeof createSpeciesSchema>;
export type UpdateSpeciesFormData = z.infer<typeof updateSpeciesSchema>;
