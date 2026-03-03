import type {
  ApiBiometry,
  ApiBiometryListResponse,
  BiometryListResponse,
  CreateBiometryData,
} from '@/features/biometry';
import { mapApiBiometry, mapApiBiometryList } from '@/features/biometry/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Biometries API Proxy';

export const GET = createListGetHandler<ApiBiometryListResponse, BiometryListResponse>({
  backendPath: '/api/company/biometries',
  mapResponse: mapApiBiometryList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, { limitParam: 'per_page' }),
});

type ApiBiometryCreateResponse = { response?: ApiBiometry } | ApiBiometry;

export const POST = createUpsertHandler<ApiBiometryCreateResponse, CreateBiometryData>({
  backendPath: '/api/company/biometry',
  method: 'POST',
  context: CONTEXT,
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiBiometry(api as ApiBiometry);
  },
});
