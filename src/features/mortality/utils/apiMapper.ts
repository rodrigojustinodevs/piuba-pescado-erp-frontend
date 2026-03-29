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
    batchId: api.batch?.id ?? '',
    batchName: api.batch?.name ?? '',
    mortalityDate: api.mortalityDate,
    quantity: api.quantity,
    cause: api.cause,
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
