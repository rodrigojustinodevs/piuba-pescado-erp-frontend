import { isAtLeast, rolesAtLeast } from '@/shared/access/roles';

/** Papéis que a API aceita em `/billing/*` (`role:admin`, com hierarquia). Gerente e operador recebem 403. */
export const BILLING_ROLES = rolesAtLeast('admin');

export function canManageBilling(role: string | undefined | null): boolean {
  return isAtLeast(role, 'admin');
}
