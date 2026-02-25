export function extractPagePerPageParams(
  searchParams: URLSearchParams,
  defaults: { page?: string; per_page?: string } = {},
): URLSearchParams {
  const params = new URLSearchParams();

  const page = searchParams.get('page') ?? defaults.page ?? '1';
  const perPage = searchParams.get('per_page') ?? defaults.per_page ?? '25';

  params.set('page', page);
  params.set('per_page', perPage);

  return params;
}

const DEFAULT_PAGE = '1';
const DEFAULT_LIMIT = '25';

/**
 * Monta query string com page, limit e search para listagens.
 * Usado por settlements, tanks, transfers e batches.
 */
export function buildPageLimitSearchQueryString(
  searchParams: URLSearchParams,
  defaults: { page?: string; limit?: string } = {},
): string {
  const params = new URLSearchParams();
  const page = searchParams.get('page') ?? defaults.page ?? DEFAULT_PAGE;
  const limit = searchParams.get('limit') ?? defaults.limit ?? DEFAULT_LIMIT;
  const search = searchParams.get('search') ?? '';

  params.set('page', page);
  params.set('limit', limit);
  if (search) params.set('search', search);

  return params.toString();
}
