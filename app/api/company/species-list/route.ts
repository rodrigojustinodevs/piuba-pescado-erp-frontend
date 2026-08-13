import type { ApiSpeciesListResponse, SpeciesListResponse } from '@/features/species';
import { mapApiSpeciesList } from '@/features/species/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Species List API Proxy';

export const GET = createListGetHandler<ApiSpeciesListResponse, SpeciesListResponse>({
  backendPath: '/api/company/species-list',
  mapResponse: mapApiSpeciesList,
  context: CONTEXT,
  buildQueryString: buildPaginationQueryString,
});
