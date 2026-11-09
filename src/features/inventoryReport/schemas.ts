import { z } from 'zod';

export const inventoryFiltersSchema = z
  .object({
    cutoffDate: z.string(),
    periodStart: z.string(),
    periodEnd: z.string(),
    situation: z.enum(['all', 'ok', 'below_minimum', 'zero']),
    categories: z.array(z.string()),
    stockTypes: z.array(z.string()),
    supplyIds: z.array(z.string()).max(200, 'Selecione no máximo 200 insumos.'),
    includeInactive: z.boolean(),
  })
  .refine((v) => !v.periodStart || !v.periodEnd || v.periodEnd >= v.periodStart, {
    path: ['periodEnd'],
    message: 'A data final deve ser igual ou posterior à data inicial.',
  });

export type FilterFieldErrors = Partial<
  Record<keyof z.infer<typeof inventoryFiltersSchema>, string>
>;

/** Converte as chaves snake_case do 422 (`period_end`, `supply_ids.0`) para os campos do form. */
const SERVER_FIELD_MAP: Record<string, keyof FilterFieldErrors> = {
  cutoff_date: 'cutoffDate',
  period_start: 'periodStart',
  period_end: 'periodEnd',
  situation: 'situation',
  categories: 'categories',
  stock_types: 'stockTypes',
  supply_ids: 'supplyIds',
  include_inactive: 'includeInactive',
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
  filters: z.infer<typeof inventoryFiltersSchema>,
): FilterFieldErrors {
  const parsed = inventoryFiltersSchema.safeParse(filters);
  if (parsed.success) return {};
  const errors: FilterFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof FilterFieldErrors | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
