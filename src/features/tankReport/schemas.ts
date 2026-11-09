import { z } from 'zod';
import { createFieldErrorHelpers, type FieldErrors } from '@/features/reportExport/fieldErrors';

export const tankFiltersSchema = z.object({
  cutoffDate: z.string(),
  status: z.enum(['all', 'active', 'inactive']),
  occupancy: z.enum(['all', 'occupied', 'idle']),
  tankIds: z.array(z.string()).max(200, 'Selecione no máximo 200 tanques.'),
  tankTypeIds: z.array(z.string()).max(50, 'Selecione no máximo 50 tipos de tanque.'),
});

type Filters = z.infer<typeof tankFiltersSchema>;

export type FilterFieldErrors = FieldErrors<Filters>;

/** Converte as chaves snake_case do 422 (ex.: `period_end`) para os campos do form. */
const SERVER_FIELD_MAP: Record<string, keyof Filters> = {
  cutoff_date: 'cutoffDate',
  status: 'status',
  occupancy: 'occupancy',
  tank_ids: 'tankIds',
  tank_type_ids: 'tankTypeIds',
};

export const { mapServerFieldErrors, validateFilters } = createFieldErrorHelpers<Filters>(
  tankFiltersSchema,
  SERVER_FIELD_MAP,
);
