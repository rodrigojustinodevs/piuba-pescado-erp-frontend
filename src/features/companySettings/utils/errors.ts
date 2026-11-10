import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import { HttpError, extractHttpStatus } from '@/shared/lib/http/httpError';

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

/**
 * Aplica os erros do 422 no formulário. As chaves do backend já seguem o caminho
 * do campo enviado (`address.zipCode`, `preferences.3.frequency`), e os formulários
 * espelham o payload. Devolve `true` se algum erro foi mapeado.
 */
export function applyServerFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  businessField?: { field: FieldPath<T>; match: RegExp },
): boolean {
  if (!(error instanceof HttpError) || error.status !== 422) return false;
  const entries = Object.entries(error.fieldErrors ?? {});
  entries.forEach(([key, messages], index) => {
    setError(
      key as FieldPath<T>,
      { type: 'server', message: messages[0] },
      { shouldFocus: index === 0 },
    );
  });
  if (entries.length > 0) return true;
  if (businessField && businessField.match.test(error.message)) {
    setError(
      businessField.field,
      { type: 'server', message: error.message },
      { shouldFocus: true },
    );
    return true;
  }
  return false;
}
