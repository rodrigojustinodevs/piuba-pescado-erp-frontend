import { z } from 'zod';

export const stockLocationTypeValues = [
  'warehouse',
  'cold_room',
  'silo',
  'storage',
  'field',
] as const;

export const stockLocationTypeOptions: Array<{ value: string; label: string }> = [
  { value: 'warehouse', label: 'Armazém' },
  { value: 'cold_room', label: 'Câmara Fria' },
  { value: 'silo', label: 'Silo' },
  { value: 'storage', label: 'Depósito' },
  { value: 'field', label: 'Campo' },
];

export const stockLocationStatusOptions: Array<{ value: string; label: string }> = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
];

export const createStockFormSchema = z.object({
  companyId: z.string().optional(),
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(stockLocationTypeValues, { message: 'Selecione o tipo de local' }),
  location: z.string().min(1, 'Localização é obrigatória'),
  responsible: z.string().optional(),
  capacity: z.number().positive('Capacidade deve ser maior que zero').optional(),
  status: z.enum(['active', 'inactive'] as const, { message: 'Selecione o status' }),
  notes: z.string().optional(),
});

export type CreateStockFormData = z.infer<typeof createStockFormSchema>;

export const updateStockFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(stockLocationTypeValues, { message: 'Selecione o tipo de local' }),
  location: z.string().min(1, 'Localização é obrigatória'),
  responsible: z.string().optional(),
  capacity: z.number().positive('Capacidade deve ser maior que zero').optional(),
  status: z.enum(['active', 'inactive'] as const, { message: 'Selecione o status' }),
  notes: z.string().optional(),
});

export type UpdateStockFormData = z.infer<typeof updateStockFormSchema>;

export const movementTypeOptions: Array<{ value: string; label: string }> = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'saida', label: 'Saída' },
  { value: 'ajuste', label: 'Ajuste manual' },
  { value: 'transferencia', label: 'Transferência' },
];

export const movementFormSchema = z
  .object({
    type: z.enum(['entrada', 'saida', 'ajuste', 'transferencia'] as const, {
      message: 'Selecione o tipo de movimentação',
    }),
    stockId: z.string().min(1, 'Estoque origem é obrigatório'),
    destStockId: z.string().optional(),
    supplyId: z.string().min(1, 'Insumo é obrigatório'),
    quantity: z.number().min(0.01, 'Quantidade deve ser maior que zero'),
    reason: z.string().min(1, 'Motivo é obrigatório'),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'transferencia' && !data.destStockId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['destStockId'],
        message: 'Estoque destino é obrigatório para transferências',
      });
    }
  });

export type MovementFormData = z.infer<typeof movementFormSchema>;
