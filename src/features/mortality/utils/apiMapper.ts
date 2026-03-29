import type {
  ApiMortality,
  ApiMortalityListResponse,
  Mortality,
  MortalityListResponse,
} from '../types';

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

function extractList(apiData: ApiMortalityListResponse): ApiMortality[] {
  const r = apiData.response;
  if (Array.isArray(r)) return r;
  if (r && typeof r === 'object' && 'data' in r && Array.isArray(r.data)) return r.data;
  return [];
}

function normalizePage(value: number | undefined): number {
  if (value == null || value < 1) return 1;
  return value;
}

function normalizeLimit(value: number | undefined): number {
  if (value == null || value < 1) return 25;
  return value;
}

export function mapApiMortalityList(apiData: ApiMortalityListResponse): MortalityListResponse {
  const mortalities: Mortality[] = extractList(apiData).map(mapApiMortality);
  return {
    mortalities,
    total: apiData.pagination?.total ?? 0,
    page: normalizePage(apiData.pagination?.current_page),
    limit: normalizeLimit(apiData.pagination?.per_page),
  };
}
