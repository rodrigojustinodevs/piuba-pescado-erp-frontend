import { z } from 'zod';
import {
  createFieldErrorHelpers,
  isPeriodOrdered,
  PERIOD_ORDER_ISSUE,
  type FieldErrors,
} from '@/features/reportExport/fieldErrors';

export const reportFiltersSchema = z
  .object({
    cutoffDate: z.string(),
    periodStart: z.string(),
    periodEnd: z.string(),
    status: z.enum(['all', 'active', 'finished']),
    batchIds: z.array(z.string()),
    tankIds: z.array(z.string()),
  })
  .refine(isPeriodOrdered, PERIOD_ORDER_ISSUE);

type Filters = z.infer<typeof reportFiltersSchema>;

export type FilterFieldErrors = FieldErrors<Filters>;

/** Converte as chaves snake_case do 422 (ex.: `period_end`) para os campos do form. */
const SERVER_FIELD_MAP: Record<string, keyof Filters> = {
  cutoff_date: 'cutoffDate',
  period_start: 'periodStart',
  period_end: 'periodEnd',
  status: 'status',
  batch_ids: 'batchIds',
  tank_ids: 'tankIds',
};

export const { mapServerFieldErrors, validateFilters } = createFieldErrorHelpers<Filters>(
  reportFiltersSchema,
  SERVER_FIELD_MAP,
);
