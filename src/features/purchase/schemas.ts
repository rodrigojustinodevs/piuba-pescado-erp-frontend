import { z } from 'zod';

export const purchaseStatusValues = [
  'draft',
  'pending',
  'ordered',
  'confirmed',
  'received',
  'cancelled',
] as const;

const itemSchema = z.object({
  supplyId: z.string().min(1, 'Insumo é obrigatório'),
  quantity: z.number().positive('Quantidade deve ser maior que zero'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  unitPrice: z.number().min(0, 'Preço unitário inválido'),
});

export const createPurchaseFormSchema = z.object({
  companyId: z.string().optional(),
  supplierId: z.string().min(1, 'Fornecedor é obrigatório'),
  invoiceNumber: z.string().optional(),
  purchaseDate: z.string().min(1, 'Data da compra é obrigatória'),
  status: z.enum(purchaseStatusValues, { message: 'Status inválido' }),
  items: z.array(itemSchema).min(1, 'Inclua pelo menos um item'),
});

export type CreatePurchaseFormData = z.infer<typeof createPurchaseFormSchema>;

/** @deprecated use createPurchaseFormSchema */
export const createPurchaseSchema = createPurchaseFormSchema;
