import { z } from 'zod';

export const supplyDefaultUnitValues = [
  'kg',
  'g',
  'liter',
  'ml',
  'unit',
  'box',
  'piece',
] as const;

export const supplyDefaultUnitSchema = z.enum(supplyDefaultUnitValues, {
  message: 'Unidade padrão inválida',
});

export const createSupplyFormSchema = z.object({
  companyId: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.string().optional(),
  defaultUnit: supplyDefaultUnitSchema,
});

export type CreateSupplyFormData = z.infer<typeof createSupplyFormSchema>;

