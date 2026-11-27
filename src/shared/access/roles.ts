import { ROLE_PERMISSIONS, type Permission } from './permissionMatrix';

/**
 * Hierarquia de papéis da API (`RolesEnum`): cada nível herda o anterior.
 * master_admin é global e passa por todas as checagens de papel e permissão.
 */
export type CompanyRole = 'operator' | 'manager' | 'admin' | 'company_admin';
export type Role = CompanyRole | 'guest' | 'master_admin';

export const ROLE_LEVEL: Record<Role, number> = {
  guest: 0,
  operator: 1,
  manager: 2,
  admin: 3,
  company_admin: 4,
  master_admin: 99,
};

/** Normaliza o papel vindo do JWT/`/auth/me` (`master`, `company-admin`...). */
export function normalizeRole(role: string | null | undefined): Role | null {
  if (!role) return null;
  const r = role.trim().toLowerCase().replaceAll('-', '_');
  if (r === 'master' || r === 'master_admin') return 'master_admin';
  return r in ROLE_LEVEL ? (r as Role) : null;
}

export function isMasterRole(role: string | null | undefined): boolean {
  return normalizeRole(role) === 'master_admin';
}

/** `isAtLeast('manager', 'manager')` → true; papel desconhecido nunca passa. */
export function isAtLeast(role: string | null | undefined, minimum: CompanyRole): boolean {
  const r = normalizeRole(role);
  if (!r) return false;
  return ROLE_LEVEL[r] >= ROLE_LEVEL[minimum];
}

export function hasPermission(role: string | null | undefined, permission: Permission): boolean {
  const r = normalizeRole(role);
  if (!r) return false;
  if (r === 'master_admin') return true;
  if (r === 'guest') return permission === 'view-dashboard';
  return ROLE_PERMISSIONS[r].includes(permission);
}

export const ROLE_LABELS: Record<Role, string> = {
  guest: 'Convidado',
  operator: 'Operador',
  manager: 'Gerente',
  admin: 'Administrador',
  company_admin: 'Administrador da empresa',
  master_admin: 'Administrador global',
};

const COMPANY_ROLES: readonly CompanyRole[] = ['operator', 'manager', 'admin', 'company_admin'];
/** Aliases do papel global aceitos pelo front (`extractRoleFromJWT` devolve `master`). */
const MASTER_ALIASES = ['master', 'master_admin'];

/**
 * Lista de papéis para APIs que ainda recebem `allowedRoles` (menu, shells de relatório).
 * Derivada da matriz: nunca escrever a lista à mão.
 */
export function rolesWithPermission(permission: Permission): string[] {
  return [
    ...MASTER_ALIASES,
    ...COMPANY_ROLES.filter((r) => ROLE_PERMISSIONS[r].includes(permission)),
  ];
}

export function rolesAtLeast(minimum: CompanyRole): string[] {
  return [...MASTER_ALIASES, ...COMPANY_ROLES.filter((r) => ROLE_LEVEL[r] >= ROLE_LEVEL[minimum])];
}
