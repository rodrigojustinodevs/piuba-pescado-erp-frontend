const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 25;

export interface PaginationOptions {
  pageParam?: string;
  limitParam?: string;
  searchParam?: string;
  defaultPage?: number;
  defaultLimit?: number;
}

function sanitizePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
}

export function buildPaginationQueryString(
  searchParams: URLSearchParams,
  options: PaginationOptions = {},
): string {
  const {
    pageParam = 'page',
    limitParam = 'limit',
    searchParam = 'search',
    defaultPage = DEFAULT_PAGE,
    defaultLimit = DEFAULT_LIMIT,
  } = options;

  const page = sanitizePositiveInt(searchParams.get(pageParam), defaultPage);

  const limit = sanitizePositiveInt(searchParams.get(limitParam), defaultLimit);

  const search = searchParams.get(searchParam)?.trim();

  const params = new URLSearchParams();

  params.set(pageParam, String(page));
  params.set(limitParam, String(limit));

  if (search) {
    params.set(searchParam, search);
  }

  return params.toString();
}
