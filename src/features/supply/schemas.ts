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

export const supplyCategoryValues = [
  'feed',
  'medicine',
  'supplement',
  'equipment',
  'chemical',
  'other',
] as const;

export const supplyCategoryOptions = [
  { value: 'feed', label: 'Ração' },
  { value: 'medicine', label: 'Medicamento' },
  { value: 'supplement', label: 'Suplemento' },
  { value: 'equipment', label: 'Equipamento' },
  { value: 'chemical', label: 'Produto Químico' },
  { value: 'other', label: 'Outros' },
];

export const supplyDefaultUnitSchema = z.enum(supplyDefaultUnitValues, {
  message: 'Unidade padrão inválida',
});

export const createSupplyFormSchema = z.object({
  companyId: z.string().optional(),
  sku: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.string().optional(),
  defaultUnit: supplyDefaultUnitSchema,
  supplierId: z.string().optional(),
  unitCost: z.number().min(0, 'Valor não pode ser negativo'),
  salePrice: z.number().min(0, 'Valor não pode ser negativo'),
  currentStock: z.number().min(0, 'Estoque não pode ser negativo'),
  minStock: z.number().min(0, 'Estoque não pode ser negativo'),
  isProduct: z.boolean(),
  description: z.string().optional(),
});

export type CreateSupplyFormData = z.infer<typeof createSupplyFormSchema>;

