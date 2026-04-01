import { z } from 'zod';

export const clientPersonTypeValues = ['company', 'individual'] as const;
export const clientPersonTypeSchema = z.enum(clientPersonTypeValues, {
  message: 'Tipo de pessoa inválido',
});

export const clientPriceGroupValues = ['retail', 'wholesale'] as const;
export const clientPriceGroupSchema = z.enum(clientPriceGroupValues, {
  message: 'Grupo de preço inválido',
});

export const createClientFormSchema = z.object({
  companyId: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  personType: clientPersonTypeSchema,
  documentNumber: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  contact: z.string().optional(),
  address: z.string().optional(),
  creditLimit: z.number().optional(),
  priceGroup: clientPriceGroupSchema,
});

export type CreateClientFormData = z.infer<typeof createClientFormSchema>;

