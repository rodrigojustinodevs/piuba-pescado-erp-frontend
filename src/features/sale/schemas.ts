import { z } from 'zod';

export const saleStatusValues = ['pending', 'confirmed', 'cancelled'] as const;
export const saleStatusSchema = z.enum(saleStatusValues, {
  message: 'Status inválido',
});

/** Status permitidos no PATCH da venda (backend: pendente e confirmado). */
export const saleUpdateStatusValues = ['pending', 'confirmed'] as const;
export const updateSaleStatusSchema = z.enum(saleUpdateStatusValues, {
  message: 'Status inválido',
});

export const saleItemSchema = z.object({
  batchId: z.string().optional(),
  stockingId: z.string().optional(),
  totalWeight: z.number().min(0.001, 'Peso deve ser maior que zero'),
  pricePerKg: z.number().min(0, 'Preço não pode ser negativo'),
  isTotalHarvest: z.boolean(),
  category: z.string().optional(),
  notes: z.string().optional(),
});

export type SaleItemFormData = z.infer<typeof saleItemSchema>;

export const createSaleFormSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  financialCategoryId: z.string().optional(),
  needsInvoice: z.boolean(),
  invoiceNumber: z.string().optional(),
  status: z.string().min(1, 'Status é obrigatório'),
  paymentMethod: z.string().optional(),
  saleDate: z.string().min(1, 'Data da venda é obrigatória'),
  dueDate: z.string().optional(),
  items: z.array(saleItemSchema).min(1, 'Adicione ao menos um item'),
  discount: z.number().min(0),
  shipping: z.number().min(0),
  taxes: z.number().min(0),
  notes: z.string().optional(),
});

export type CreateSaleFormData = z.infer<typeof createSaleFormSchema>;

export const updateSaleFormSchema = createSaleFormSchema;
