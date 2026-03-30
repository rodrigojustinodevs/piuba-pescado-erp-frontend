import { z } from 'zod';

export const createSupplierFormSchema = z.object({
  companyId: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  contact: z.string().min(1, 'Contato é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.email('E-mail inválido'),
});

export type CreateSupplierFormData = z.infer<typeof createSupplierFormSchema>;

/** @deprecated use createSupplierFormSchema */
export const createSupplierSchema = createSupplierFormSchema;
