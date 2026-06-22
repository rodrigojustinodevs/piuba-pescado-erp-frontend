import type {
  ApiMortality,
  ApiMortalityListResponse,
  Mortality,
  MortalityListResponse,
} from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

export function mapApiMortality(api: ApiMortality): Mortality {
  return {
    id: api.id,
    batchId: api.batchId ?? api.batch?.id ?? '',
    batch: api.batch
      ? { id: api.batch.id ?? '', name: api.batch.name ?? '', initialQuantity: api.batch.initialQuantity }
      : undefined,
    mortalityDate: api.mortalityDate,
    quantity: api.quantity,
    cause: api.cause,
    severity: api.severity ?? 'medium',
    description: api.description,
    batchPercentage: api.batchPercentage ?? 0,
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt,
  };
}

export function mapApiMortalityList(apiData: ApiMortalityListResponse): MortalityListResponse {
  const mortalities: Mortality[] = extractListFromPagedApiResponse(apiData).map(mapApiMortality);
  return {
    mortalities,
    ...getApiPagedListMeta(apiData),
  };
}
