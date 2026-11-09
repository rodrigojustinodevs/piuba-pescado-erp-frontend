import { z } from 'zod';

export const tankFiltersSchema = z.object({
  cutoffDate: z.string(),
  status: z.enum(['all', 'active', 'inactive']),
  occupancy: z.enum(['all', 'occupied', 'idle']),
  tankIds: z.array(z.string()).max(200, 'Selecione no máximo 200 tanques.'),
  tankTypeIds: z.array(z.string()).max(50, 'Selecione no máximo 50 tipos de tanque.'),
});

export type FilterFieldErrors = Partial<Record<keyof z.infer<typeof tankFiltersSchema>, string>>;

/** Converte as chaves snake_case do 422 (`tank_ids.0`) para os campos do form. */
const SERVER_FIELD_MAP: Record<string, keyof FilterFieldErrors> = {
  cutoff_date: 'cutoffDate',
  status: 'status',
  occupancy: 'occupancy',
  tank_ids: 'tankIds',
  tank_type_ids: 'tankTypeIds',
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

export function validateFilters(filters: z.infer<typeof tankFiltersSchema>): FilterFieldErrors {
  const parsed = tankFiltersSchema.safeParse(filters);
  if (parsed.success) return {};
  const errors: FilterFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof FilterFieldErrors | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
