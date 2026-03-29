/**
 * Listagens paginadas cujo `response` pode vir como array ou como `{ data: [] }`.
 */

type ApiListPayload<T> = T[] | { data?: T[] };

export type ApiPagedListEnvelope<T> = {
  response?: ApiListPayload<T>;
  pagination?: {
    total?: number;
    current_page?: number;
    per_page?: number;
  };
};

export function extractListFromPagedApiResponse<T>(apiData: ApiPagedListEnvelope<T>): T[] {
  const r = apiData.response;
  if (Array.isArray(r)) return r;
  if (r && typeof r === 'object' && 'data' in r && Array.isArray(r.data)) return r.data;
  return [];
}

export function normalizeApiListPage(value: number | undefined): number {
  if (value == null || value < 1) return 1;
  return value;
}

export function normalizeApiListLimit(value: number | undefined): number {
  if (value == null || value < 1) return 25;
  return value;
}

export function getApiPagedListMeta(apiData: ApiPagedListEnvelope<unknown>): {
  total: number;
  page: number;
  limit: number;
} {
  return {
    total: apiData.pagination?.total ?? 0,
    page: normalizeApiListPage(apiData.pagination?.current_page),
    limit: normalizeApiListLimit(apiData.pagination?.per_page),
  };
}
