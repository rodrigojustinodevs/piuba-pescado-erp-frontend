import { UserRole, type UserRoleType } from '@/shared/types/auth';

export const ROLE_LABELS: Record<string, string> = {
  [UserRole.MASTER]: 'Master',
  [UserRole.MASTER_ADMIN]: 'Master Admin',
  [UserRole.COMPANY_ADMIN]: 'Administrador da Empresa',
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.MANAGER]: 'Gerente',
  [UserRole.OPERATOR]: 'Operador',
  [UserRole.GUEST]: 'Convidado',
};

export const ROLE_BADGE_STYLES: Record<string, string> = {
  [UserRole.MASTER]: 'bg-violet-100 text-violet-700 border-violet-200',
  [UserRole.MASTER_ADMIN]: 'bg-violet-100 text-violet-700 border-violet-200',
  [UserRole.COMPANY_ADMIN]: 'bg-teal-100 text-teal-700 border-teal-200',
  [UserRole.ADMIN]: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  [UserRole.MANAGER]: 'bg-blue-100 text-blue-700 border-blue-200',
  [UserRole.OPERATOR]: 'bg-slate-100 text-slate-600 border-slate-200',
  [UserRole.GUEST]: 'bg-gray-100 text-gray-500 border-gray-200',
};

export function getRoleLabel(role: UserRoleType): string {
  return ROLE_LABELS[role] ?? role;
}

export function getRoleBadgeClassName(role: UserRoleType): string {
  return ROLE_BADGE_STYLES[role] ?? 'bg-slate-100 text-slate-600 border-slate-200';
}

/**
 * Perfis aceitos pela API ao criar/atualizar o role de um usuário da empresa.
 * `master` não está incluso: é um papel de plataforma (fora do escopo de uma empresa)
 * e nunca deve ser enviado por este formulário.
 */
export const ROLE_OPTIONS: Array<{ value: UserRoleType; label: string }> = [
  { value: UserRole.GUEST, label: ROLE_LABELS[UserRole.GUEST] },
  { value: UserRole.OPERATOR, label: ROLE_LABELS[UserRole.OPERATOR] },
  { value: UserRole.MANAGER, label: ROLE_LABELS[UserRole.MANAGER] },
  { value: UserRole.ADMIN, label: ROLE_LABELS[UserRole.ADMIN] },
  { value: UserRole.COMPANY_ADMIN, label: ROLE_LABELS[UserRole.COMPANY_ADMIN] },
  { value: UserRole.MASTER_ADMIN, label: ROLE_LABELS[UserRole.MASTER_ADMIN] },
];
