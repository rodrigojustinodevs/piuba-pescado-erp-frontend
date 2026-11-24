import { UserRole, type UserRoleType } from '@/shared/types/auth';

/** Papéis que a API aceita em `/billing/*`. Gerente e operador recebem 403. */
export const BILLING_ROLES: UserRoleType[] = [
  UserRole.ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.MASTER_ADMIN,
  UserRole.MASTER,
];

export function canManageBilling(role: string | undefined | null): boolean {
  const r = (role ?? '').replaceAll('-', '_');
  return BILLING_ROLES.includes(r);
}
