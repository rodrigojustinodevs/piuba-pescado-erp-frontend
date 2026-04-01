import type { ApiClientListResponse, ClientListResponse } from '@/features/client/types';
import { mapApiClientList } from '@/features/client/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Clients API Proxy';

export const GET = createListGetHandler<ApiClientListResponse, ClientListResponse>({
  backendPath: '/api/company/clients',
  mapResponse: mapApiClientList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, {
      limitParam: 'per_page',
      passthrough: [],
    }),
});

