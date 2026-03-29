import type { ApiWaterQuality, CreateWaterQualityData } from '@/features/waterQuality/types';
import { mapApiWaterQuality, mapCreateWaterQualityToApiPayload } from '@/features/waterQuality/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Water quality API Proxy';

type ApiWaterQualityCreateResponse = { response?: ApiWaterQuality } | ApiWaterQuality;

export const POST = createUpsertHandler<ApiWaterQualityCreateResponse, CreateWaterQualityData>({
  backendPath: '/api/company/water-quality',
  method: 'POST',
  context: CONTEXT,
  mapBody: mapCreateWaterQualityToApiPayload,
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiWaterQuality(api as ApiWaterQuality);
  },
});
