import { z } from 'zod';

export const createSensorSchema = z.object({
  sensorType: z.string().min(1, 'Tipo do sensor é obrigatório'),
  installationDate: z.string().min(1, 'Data de instalação é obrigatória'),
  status: z.string().min(1, 'Status é obrigatório'),
  tankId: z.string().min(1, 'Tanque é obrigatório'),
});

export type CreateSensorFormData = z.infer<typeof createSensorSchema>;
