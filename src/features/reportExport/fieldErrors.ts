import type { z } from 'zod';

export type FieldErrors<TFilters> = Partial<Record<keyof TFilters, string>>;

/**
 * Cria `validateFilters` (zod → erros por campo) e `mapServerFieldErrors`
 * (chaves snake_case do 422, ex.: `period_end`, `client_ids.0` → campos do form).
 */
export function createFieldErrorHelpers<TFilters>(
  schema: z.ZodType<unknown>,
  serverFieldMap: Record<string, keyof TFilters>,
) {
  function mapServerFieldErrors(
    errors: Record<string, string[]> | undefined,
  ): FieldErrors<TFilters> {
    const result: FieldErrors<TFilters> = {};
    if (!errors) return result;
    for (const [key, messages] of Object.entries(errors)) {
      const field = serverFieldMap[key.split('.')[0]];
      if (field && !result[field]) result[field] = messages[0];
    }
    return result;
  }

  function validateFilters(filters: TFilters): FieldErrors<TFilters> {
    const parsed = schema.safeParse(filters);
    if (parsed.success) return {};
    const errors: FieldErrors<TFilters> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof TFilters | undefined;
      if (field && !errors[field]) errors[field] = issue.message;
    }
    return errors;
  }

  return { mapServerFieldErrors, validateFilters };
}

/** Regra comum aos relatórios com período: fim >= início. */
export const PERIOD_ORDER_ISSUE = {
  path: ['periodEnd'],
  message: 'A data final deve ser igual ou posterior à data inicial.',
};

export const isPeriodOrdered = (v: { periodStart: string; periodEnd: string }) =>
  !v.periodStart || !v.periodEnd || v.periodEnd >= v.periodStart;
