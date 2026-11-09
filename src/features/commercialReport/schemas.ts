import { z } from 'zod';
import {
  createFieldErrorHelpers,
  isPeriodOrdered,
  PERIOD_ORDER_ISSUE,
  type FieldErrors,
} from '@/features/reportExport/fieldErrors';

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
  .refine(isPeriodOrdered, PERIOD_ORDER_ISSUE);

type Filters = z.infer<typeof commercialFiltersSchema>;

export type FilterFieldErrors = FieldErrors<Filters>;

/** Converte as chaves snake_case do 422 (ex.: `period_end`) para os campos do form. */
const SERVER_FIELD_MAP: Record<string, keyof Filters> = {
  cutoff_date: 'cutoffDate',
  period_start: 'periodStart',
  period_end: 'periodEnd',
  status: 'status',
  payment_method: 'paymentMethod',
  client_ids: 'clientIds',
  batch_ids: 'batchIds',
};

export const { mapServerFieldErrors, validateFilters } = createFieldErrorHelpers<Filters>(
  commercialFiltersSchema,
  SERVER_FIELD_MAP,
);
