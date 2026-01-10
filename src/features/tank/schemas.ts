import { z } from "zod";

/**
 * Schema de validação para criação de tanque
 */
export const createTankSchema = z.object({
  companyId: z.string().min(1, "Empresa é obrigatória"),
  tankTypeId: z.string().min(1, "Tipo de tanque é obrigatório"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  capacityLiters: z.number().min(0.01, "Capacidade deve ser maior que zero"),
  location: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

/**
 * Schema de validação para atualização de tanque
 */
export const updateTankSchema = createTankSchema.partial().extend({
  id: z.string().min(1, "ID é obrigatório"),
});

/**
 * Tipos inferidos dos schemas
 */
export type CreateTankFormData = z.infer<typeof createTankSchema>;
export type UpdateTankFormData = z.infer<typeof updateTankSchema>;


