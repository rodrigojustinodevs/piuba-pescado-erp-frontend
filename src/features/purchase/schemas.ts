import { z } from 'zod';

export const purchaseStatusValues = [
  'draft',
  'submitted',
  'approved',
  'partially_received',
  'received',
  'cancelled',
] as const;

export type PurchaseStatus = (typeof purchaseStatusValues)[number];

const itemSchema = z.object({
  supplyId: z.string().min(1, 'Insumo é obrigatório'),
  quantity: z.number().positive('Quantidade deve ser maior que zero'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  unitPrice: z.number().min(0, 'Preço unitário inválido'),
  discount: z.number().min(0).default(0),
});

export const createPurchaseFormSchema = z.object({
  companyId: z.string().optional(),
  referenceCode: z.string().optional(),
  supplierId: z.string().min(1, 'Fornecedor é obrigatório'),
  supplierDocument: z.string().optional(),
  responsibleName: z.string().optional(),
  invoiceNumber: z.string().optional(),
  orderDate: z.string().min(1, 'Data da compra é obrigatória'),
  expectedDeliveryDate: z.string().optional(),
  status: z.enum(purchaseStatusValues, { message: 'Status inválido' }),
  paymentMethod: z.string().optional(),
  items: z.array(itemSchema).min(1, 'Inclua pelo menos um item'),
  freightCost: z.number().min(0).default(0),
  otherCosts: z.number().min(0).default(0),
  notes: z.string().optional(),
});

export type CreatePurchaseFormData = z.infer<typeof createPurchaseFormSchema>;

/** @deprecated use createPurchaseFormSchema */
export const createPurchaseSchema = createPurchaseFormSchema;

export const registerPaymentSchema = z.object({
  payment_date: z.string().min(1, 'Data do pagamento é obrigatória'),
  amount: z
    .number({ error: 'Valor inválido' })
    .positive('Valor deve ser maior que zero'),
  payment_method: z.string().min(1, 'Método de pagamento é obrigatório'),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type RegisterPaymentFormData = z.infer<typeof registerPaymentSchema>;

export const receivePurchaseSchema = z.object({
  items: z
    .array(
      z.object({
        purchase_item_id: z.string(),
        received_quantity: z.number().min(0),
      }),
    )
    .refine((items) => items.some((i) => i.received_quantity > 0), {
      message: 'Informe ao menos uma quantidade maior que zero.',
    }),
});

export type ReceivePurchaseFormData = z.infer<typeof receivePurchaseSchema>;
