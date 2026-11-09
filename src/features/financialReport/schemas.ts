import { z } from 'zod';
import { createFieldErrorHelpers, type FieldErrors } from '@/features/reportExport/fieldErrors';
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

type Filters = z.infer<typeof financialFiltersSchema>;

export type FilterFieldErrors = FieldErrors<Filters>;

/** Converte as chaves snake_case do 422 (ex.: `period_end`) para os campos do form. */
const SERVER_FIELD_MAP: Record<string, keyof Filters> = {
  cutoff_date: 'cutoffDate',
  period_start: 'periodStart',
  period_end: 'periodEnd',
  category_ids: 'categoryIds',
};

export const { mapServerFieldErrors, validateFilters } = createFieldErrorHelpers<Filters>(
  financialFiltersSchema,
  SERVER_FIELD_MAP,
);
