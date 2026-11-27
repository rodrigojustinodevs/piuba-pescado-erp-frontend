import { extractHttpStatus } from '@/shared/lib/http/httpError';

export const FORBIDDEN_MESSAGE = 'Você não tem permissão para alterar estas configurações.';
export const EXPORT_LIMIT_MESSAGE = 'Limite de exportações atingido. Tente novamente mais tarde.';

export function errorStatus(error: unknown): number | null {
  return extractHttpStatus(error);
}

export function errorMessage(error: unknown, fallback = 'Não foi possível concluir a operação.') {
  return error instanceof Error && error.message ? error.message : fallback;
}

/** 422 do master_admin sem empresa ativa. */
export function isNoCompanyError(error: unknown): boolean {
  if (errorStatus(error) !== 422) return false;
  const message = errorMessage(error, '');
  return message.includes('switch-company') || message.includes('Selecione uma empresa');
}

export { applyServerFieldErrors } from '@/shared/utils/formErrors';
