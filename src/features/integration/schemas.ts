import { z } from 'zod';

export const createIntegrationSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  manufacturer: z.string().min(1, 'Fabricante é obrigatório'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  type: z.enum(['gateway', 'sensor', 'controller', 'webhook', 'external_api']),
  protocol: z.enum(['MQTT', 'HTTP', 'Modbus', 'LoRaWAN']),
  endpoint: z.string().min(3, 'Endpoint é obrigatório'),
});

export type CreateIntegrationFormData = z.infer<typeof createIntegrationSchema>;
