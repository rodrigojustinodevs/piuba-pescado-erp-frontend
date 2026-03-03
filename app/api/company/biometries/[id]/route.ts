import type { Biometry, UpdateBiometryData } from '@/features/biometry';
import { mapApiBiometryDetail, type ApiBiometryDetail } from '@/features/biometry/utils/apiMapper';
import { createDetailGetHandler, createPutHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Biometries API Proxy';

/** Backend retorna { response: ApiBiometryDetail } no GET/PUT por id (formato plano, com batchId). */
type ApiBiometryDetailEnvelope = { response?: ApiBiometryDetail } | ApiBiometryDetail;

function mapDetailResponse(data: ApiBiometryDetailEnvelope): Biometry {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiBiometryDetail(api as ApiBiometryDetail);
}

export const GET = createDetailGetHandler<ApiBiometryDetailEnvelope, Biometry, { id: string }>({
  backendPathBuilder: (params) => `/api/company/biometry/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<ApiBiometryDetailEnvelope, UpdateBiometryData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/biometry/${params.id}`,
  context: CONTEXT,
  mapBody: ({ id: _id, ...rest }) => rest,
  mapResponse: mapDetailResponse,
});
