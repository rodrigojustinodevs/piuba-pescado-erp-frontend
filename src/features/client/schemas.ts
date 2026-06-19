import { z } from 'zod';

export const clientPersonTypeValues = ['company', 'individual'] as const;
export const clientPersonTypeSchema = z.enum(clientPersonTypeValues, {
  message: 'Tipo de pessoa inválido',
});

export const clientPriceGroupValues = ['retail', 'wholesale'] as const;
export const clientPriceGroupSchema = z.enum(clientPriceGroupValues, {
  message: 'Grupo de preço inválido',
});

export const clientStatusFormValues = ['active', 'prospect', 'inactive'] as const;
export const clientStatusFormSchema = z.enum(clientStatusFormValues, {
  message: 'Status inválido',
});

export const createClientFormSchema = z.object({
  companyId: z.string().optional(),
  personType: clientPersonTypeSchema,
  name: z.string().min(1, 'Razão Social é obrigatória'),
  tradeName: z.string().optional(),
  documentNumber: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  priceGroup: clientPriceGroupSchema,
  city: z.string().optional(),
  state: z.string().max(2, 'UF deve ter 2 letras').optional(),
  status: clientStatusFormSchema.optional(),
  creditLimit: z.number().optional(),
  notes: z.string().optional(),
});

export type CreateClientFormData = z.infer<typeof createClientFormSchema>;
