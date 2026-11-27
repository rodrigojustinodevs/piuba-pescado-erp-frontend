import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import { HttpError } from '@/shared/lib/http/httpError';

export const FIELD_ERRORS_TOAST = 'Verifique os campos destacados.';

/** O erro da API traz erros por campo (`fieldErrors`) para mostrar no formulário. */
export function hasServerFieldErrors(error: unknown): error is HttpError {
  return error instanceof HttpError && Object.keys(error.fieldErrors ?? {}).length > 0;
}

/**
 * Aplica no formulário os erros por campo devolvidos pela API
 * (`{ fieldErrors: { location: ['...'] } }`). As chaves seguem o caminho do campo
 * enviado (`address.zipCode`), e os formulários espelham o payload. Foca o primeiro.
 * `businessField` cobre o 422 sem `fieldErrors` cuja mensagem pertence a um campo.
 * Devolve `true` se algum erro foi mapeado.
 */
export function applyServerFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  businessField?: { field: FieldPath<T>; match: RegExp },
): boolean {
  if (!(error instanceof HttpError)) return false;
  const entries = Object.entries(error.fieldErrors ?? {}).filter(([, messages]) => messages?.[0]);
  entries.forEach(([key, messages], index) => {
    setError(
      key as FieldPath<T>,
      { type: 'server', message: messages[0] },
      { shouldFocus: index === 0 },
    );
  });
  if (entries.length > 0) return true;
  if (error.status === 422 && businessField?.match.test(error.message)) {
    setError(
      businessField.field,
      { type: 'server', message: error.message },
      { shouldFocus: true },
    );
    return true;
  }
  return false;
}
