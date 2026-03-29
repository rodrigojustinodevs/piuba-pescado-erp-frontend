import { z } from 'zod';

const finiteNonNeg = (label: string) =>
  z.number().refine((n) => Number.isFinite(n) && n >= 0, { message: `${label} inválido` });

export const createWaterQualitySchema = z.object({
  tankId: z.string().min(1, 'Tanque é obrigatório'),
  measuredAt: z.string().min(1, 'Data e hora da medição são obrigatórias'),
  ph: z
    .number()
    .refine((n) => Number.isFinite(n) && n > 0 && n <= 14, {
      message: 'pH deve ser entre 0 e 14',
    }),
  dissolvedOxygen: finiteNonNeg('Oxigênio dissolvido'),
  temperature: z.number().refine((n) => Number.isFinite(n), { message: 'Temperatura inválida' }),
  ammonia: finiteNonNeg('Amônia'),
  salinity: finiteNonNeg('Salinidade'),
  turbidity: finiteNonNeg('Turbidez'),
  notes: z.string().optional(),
});

export type CreateWaterQualityFormData = z.infer<typeof createWaterQualitySchema>;
