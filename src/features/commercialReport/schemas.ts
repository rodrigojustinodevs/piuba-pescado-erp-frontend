import { z } from 'zod';

export const commercialFiltersSchema = z
  .object({
    cutoffDate: z.string(),
    periodStart: z.string(),
    periodEnd: z.string(),
    status: z.enum(['all', 'pending', 'confirmed', 'paid', 'delivered', 'overdue']),
    paymentMethod: z.string(),
    clientIds: z.array(z.string()),
    batchIds: z.array(z.string()),
  })
  .refine((v) => !v.periodStart || !v.periodEnd || v.periodEnd >= v.periodStart, {
    path: ['periodEnd'],
    message: 'A data final deve ser igual ou posterior à data inicial.',
  });

export type FilterFieldErrors = Partial<
  Record<keyof z.infer<typeof commercialFiltersSchema>, string>
>;

/** Converte as chaves snake_case do 422 (`period_end`, `client_ids.0`) para os campos do form. */
const SERVER_FIELD_MAP: Record<string, keyof FilterFieldErrors> = {
  cutoff_date: 'cutoffDate',
  period_start: 'periodStart',
  period_end: 'periodEnd',
  status: 'status',
  payment_method: 'paymentMethod',
  client_ids: 'clientIds',
  batch_ids: 'batchIds',
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
  filters: z.infer<typeof commercialFiltersSchema>,
): FilterFieldErrors {
  const parsed = commercialFiltersSchema.safeParse(filters);
  if (parsed.success) return {};
  const errors: FilterFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof FilterFieldErrors | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
