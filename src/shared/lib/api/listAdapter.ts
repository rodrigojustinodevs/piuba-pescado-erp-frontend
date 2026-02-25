type BackendPagination = {
  total?: number;
  current_page?: number;
  per_page?: number;
};

export type BackendListResponse<T> = {
  response?: T[];
  pagination?: BackendPagination;
};

export type FrontListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 25;

export function adaptListResponse<T>(payload: BackendListResponse<T>): FrontListResponse<T> {
  return {
    items: payload.response ?? [],
    total: payload.pagination?.total ?? 0,
    page: payload.pagination?.current_page ?? DEFAULT_PAGE,
    limit: payload.pagination?.per_page ?? DEFAULT_LIMIT,
  };
}
