import { z } from 'zod';

export const createSensorReadingSchema = z.object({
  sensorId: z.string().min(1, 'Sensor é obrigatório'),
  value: z.number().refine((n) => Number.isFinite(n), { message: 'Valor é obrigatório' }),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  measuredAt: z.string().min(1, 'Data e hora da medição são obrigatórias'),
  notes: z.string().optional(),
});

export type CreateSensorReadingFormData = z.infer<typeof createSensorReadingSchema>;
