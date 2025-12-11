import { z } from "zod";

/**
 * Schema de validação para CNPJ
 */
const cnpjSchema = z
  .string()
  .min(1, "CNPJ é obrigatório")
  .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ deve estar no formato 00.000.000/0000-00");

/**
 * Schema de validação para CEP
 */
const zipCodeSchema = z
  .string()
  .min(1, "CEP é obrigatório")
  .regex(/^\d{5}-?\d{3}$/, "CEP deve estar no formato 00000-000");

/**
 * Schema de validação para telefone
 */
const phoneSchema = z
  .string()
  .min(1, "Telefone é obrigatório")
  .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, "Telefone deve estar no formato (00) 00000-0000");

/**
 * Schema de validação para criação de empresa
 */
export const createCompanySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").min(3, "Nome deve ter no mínimo 3 caracteres"),
  cnpj: cnpjSchema,
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  phone: phoneSchema,
  address: z.object({
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(2, "Estado é obrigatório").max(2, "Estado deve ter 2 caracteres"),
    zipCode: zipCodeSchema,
  }),
  active: z.boolean().optional(),
});

/**
 * Schema de validação para atualização de empresa
 */
export const updateCompanySchema = createCompanySchema.partial().extend({
  id: z.string().min(1, "ID é obrigatório"),
});

/**
 * Tipos inferidos dos schemas
 */
export type CreateCompanyFormData = z.infer<typeof createCompanySchema>;
export type UpdateCompanyFormData = z.infer<typeof updateCompanySchema>;

