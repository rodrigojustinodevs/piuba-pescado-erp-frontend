import { z } from 'zod';
import {
  createFieldErrorHelpers,
  isPeriodOrdered,
  PERIOD_ORDER_ISSUE,
  type FieldErrors,
} from '@/features/reportExport/fieldErrors';

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
  .refine(isPeriodOrdered, PERIOD_ORDER_ISSUE);

type Filters = z.infer<typeof inventoryFiltersSchema>;

export type FilterFieldErrors = FieldErrors<Filters>;

/** Converte as chaves snake_case do 422 (ex.: `period_end`) para os campos do form. */
const SERVER_FIELD_MAP: Record<string, keyof Filters> = {
  cutoff_date: 'cutoffDate',
  period_start: 'periodStart',
  period_end: 'periodEnd',
  situation: 'situation',
  categories: 'categories',
  stock_types: 'stockTypes',
  supply_ids: 'supplyIds',
  include_inactive: 'includeInactive',
};

export const { mapServerFieldErrors, validateFilters } = createFieldErrorHelpers<Filters>(
  inventoryFiltersSchema,
  SERVER_FIELD_MAP,
);
