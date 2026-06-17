import { z } from 'zod';

export const supplierCategoryValues = [
  'feed',
  'medication',
  'equipment',
  'supply',
  'service',
  'logistics',
  'other',
] as const;

export const supplierCategoryOptions = [
  { value: 'feed', label: 'Ração' },
  { value: 'medication', label: 'Medicamento' },
  { value: 'equipment', label: 'Equipamento' },
  { value: 'supply', label: 'Insumo' },
  { value: 'service', label: 'Serviço' },
  { value: 'logistics', label: 'Logística' },
  { value: 'other', label: 'Outros' },
];

export const supplierStatusValues = ['active', 'inactive', 'suspended'] as const;

export const supplierStatusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'suspended', label: 'Suspenso' },
];

export const createSupplierFormSchema = z.object({
  companyId: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  tradeName: z.string().optional(),
  document: z
    .string()
    .min(1, 'CPF/CNPJ é obrigatório')
    .refine((value) => {
      const digits = value.replace(/\D/g, '');
      return digits.length === 11 || digits.length === 14;
    }, 'CPF/CNPJ inválido'),
  stateRegistration: z.string().optional(),
  contact: z.string().optional(),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.email('E-mail inválido'),
  category: z.enum(supplierCategoryValues).optional(),
  paymentTerms: z.string().optional(),
  status: z.enum(supplierStatusValues),
  rating: z
    .number()
    .min(0, 'Avaliação mínima é 0')
    .max(5, 'Avaliação máxima é 5')
    .optional(),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().max(2, 'Estado deve ter 2 caracteres').optional(),
    zipCode: z.string().optional(),
  }),
});

export type CreateSupplierFormData = z.infer<typeof createSupplierFormSchema>;

/** @deprecated use createSupplierFormSchema */
export const createSupplierSchema = createSupplierFormSchema;
