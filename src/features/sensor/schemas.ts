import { z } from 'zod';

const sensorTypeEnum = z.enum(['ph', 'temperature', 'dissolved_oxygen', 'ammonia', 'etc']);
const sensorStatusEnum = z.enum(['active', 'inactive', 'maintenance']);

export const createSensorSchema = z.object({
  sensorType: z.string().min(1, 'Tipo do sensor é obrigatório'),
  installationDate: z.string().min(1, 'Data de instalação é obrigatória'),
  status: z.string().min(1, 'Status é obrigatório'),
  tankId: z.string().min(1, 'Tanque é obrigatório'),
});

export type CreateSensorFormData = z.infer<typeof createSensorSchema>;

const finiteNumber = (message: string) =>
  z.number().refine((n) => Number.isFinite(n), { message });

const baseSensorDialogSchema = z.object({
  companyId: z.string().optional(),
  sensorType: sensorTypeEnum,
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  serialNumber: z.string().trim().min(1, 'Número de série é obrigatório'),
  battery: finiteNumber('Bateria inválida')
    .min(0, 'Bateria deve ser no mínimo 0')
    .max(100, 'Bateria deve ser no máximo 100'),
  unit: z.string().trim().min(1, 'Unidade é obrigatória'),
  lastReading: finiteNumber('Última leitura inválida'),
  installationDate: z.string().min(1, 'Data de instalação é obrigatória'),
  status: sensorStatusEnum,
  notes: z.string().trim().max(1000, 'Observações muito longas').optional(),
});

export const createSensorDialogSchema = baseSensorDialogSchema.extend({
  tankId: z.string().min(1, 'Tanque é obrigatório'),
});

export const updateSensorDialogSchema = baseSensorDialogSchema.extend({
  tankId: z.string().optional(),
});

export type CreateSensorDialogFormData = z.infer<typeof createSensorDialogSchema>;
export type UpdateSensorDialogFormData = z.infer<typeof updateSensorDialogSchema>;
