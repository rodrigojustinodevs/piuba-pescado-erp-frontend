import { z } from 'zod';
import { UserRole } from '@/shared/types/auth';
import { Position } from './utils/positionLabels';

const ROLE_VALUES = Object.values(UserRole) as [string, ...string[]];
const POSITION_VALUES = Object.values(Position) as [string, ...string[]];

/**
 * Schema de validação para criação de usuário
 */
export const createUserSchema = z.object({
  companyId: z.string().min(1, 'Empresa é obrigatória'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  position: z.enum(POSITION_VALUES).optional(),
  role: z.enum(ROLE_VALUES),
  status: z.enum(['active', 'inactive', 'blocked']),
});

/**
 * Schema de validação para atualização de usuário
 */
export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().min(1, 'ID é obrigatório'),
});

/**
 * Tipos inferidos dos schemas
 */
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
