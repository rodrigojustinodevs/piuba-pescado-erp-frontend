import { z } from 'zod';
import { MAX_WINDOW_MONTHS } from './constants';

/** Nº de meses (inclusive) entre duas datas YYYY-MM-DD. */
function monthsSpan(start: string, end: string): number {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}

export const financialFiltersSchema = z
  .object({
    cutoffDate: z.string(),
    periodStart: z.string(),
    periodEnd: z.string(),
    categoryIds: z.array(z.string()),
  })
  .superRefine((v, ctx) => {
    if (!v.periodStart || !v.periodEnd) return;
    if (v.periodEnd < v.periodStart) {
      ctx.addIssue({
        code: 'custom',
        path: ['periodEnd'],
        message: 'A data final deve ser igual ou posterior à data inicial.',
      });
    } else if (monthsSpan(v.periodStart, v.periodEnd) > MAX_WINDOW_MONTHS) {
      ctx.addIssue({
        code: 'custom',
        path: ['periodEnd'],
        message: `A janela do fluxo de caixa pode ter no máximo ${MAX_WINDOW_MONTHS} meses.`,
      });
    }
  });

export type FilterFieldErrors = Partial<
  Record<keyof z.infer<typeof financialFiltersSchema>, string>
>;

/** Converte as chaves snake_case do 422 (`period_end`, `category_ids.0`) para os campos do form. */
const SERVER_FIELD_MAP: Record<string, keyof FilterFieldErrors> = {
  cutoff_date: 'cutoffDate',
  period_start: 'periodStart',
  period_end: 'periodEnd',
  category_ids: 'categoryIds',
};

export function mapServerFieldErrors(
  errors: Record<string, string[]> | undefined,
): FilterFieldErrors {
  const result: FilterFieldErrors = {};
  if (!errors) return result;
  for (const [key, messages] of Object.entries(errors)) {
    const field = SERVER_FIELD_MAP[key.split('.')[0]];
    if (field && !result[field]) result[field] = messages[0];
  }
  return result;
}

export function validateFilters(
  filters: z.infer<typeof financialFiltersSchema>,
): FilterFieldErrors {
  const parsed = financialFiltersSchema.safeParse(filters);
  if (parsed.success) return {};
  const errors: FilterFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof FilterFieldErrors | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
