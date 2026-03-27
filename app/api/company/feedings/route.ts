import type {
  ApiFeeding,
  ApiFeedingListResponse,
  CreateFeedingData,
  FeedingListResponse,
} from '@/features/feeding/types';
import { mapApiFeeding, mapApiFeedingList } from '@/features/feeding/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Feedings API Proxy';

export const GET = createListGetHandler<ApiFeedingListResponse, FeedingListResponse>({
  backendPath: '/api/company/feedings',
  mapResponse: mapApiFeedingList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, { limitParam: 'per_page' }),
});

type ApiFeedingCreateResponse = { response?: ApiFeeding } | ApiFeeding;

export const POST = createUpsertHandler<ApiFeedingCreateResponse, CreateFeedingData>({
  backendPath: '/api/company/feeding',
  method: 'POST',
  context: CONTEXT,
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiFeeding(api as ApiFeeding);
  },
});
