import { UserRole } from '@/shared/types/auth';

/**
 * O front só conhece o role; permissões individuais (grant) não são visíveis.
 * - `full`: role tem `manage-company-settings` por padrão.
 * - `probe`: pode ter recebido o grant; a aba tenta e trata 403.
 * - `none`: nunca gerencia (só leitura + preferência pessoal).
 */
export type SettingsAccess = 'full' | 'probe' | 'none';

function normalize(role: string | undefined): string {
  return (role ?? '').replaceAll('-', '_');
}

export function getSettingsAccess(role: string | undefined): SettingsAccess {
  const r = normalize(role);
  if (r === UserRole.MASTER || r === UserRole.MASTER_ADMIN || r === UserRole.COMPANY_ADMIN) {
    return 'full';
  }
  if (r === UserRole.MANAGER || r === UserRole.ADMIN) return 'probe';
  return 'none';
}

/** Abas Segurança, Aparência e Dados: só master_admin vê e altera. */
export function isMasterAdmin(role: string | undefined): boolean {
  const r = normalize(role);
  return r === UserRole.MASTER_ADMIN || r === UserRole.MASTER;
}

export function canSeeSettings(role: string | undefined): boolean {
  const r = normalize(role);
  return Boolean(r) && r !== UserRole.GUEST;
}
