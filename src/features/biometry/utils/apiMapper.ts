import type {
  ApiBiometry,
  ApiBiometryListResponse,
  Biometry,
  BiometryListResponse,
} from '../types';

/**
 * Formato plano retornado pela API no GET por id (sem objeto batch).
 */
export type ApiBiometryDetail = {
  id: string;
  batchId: string;
  biometryDate: string;
  averageWeight: number;
  fcr: number;
  createdAt: string;
  updatedAt: string;
  batchName?: string;
};

export function mapApiBiometry(api: ApiBiometry): Biometry {
  const batch =
    (api as { batch?: ApiBiometry['batch']; batche?: ApiBiometry['batch'] }).batch ??
    (api as { batche?: { id: string; name: string } }).batche;
  return {
    id: api.id,
    batchId: batch?.id ?? '',
    batchName: batch?.name ?? '',
    biometryDate: api.biometryDate,
    averageWeight: api.averageWeight,
    fcr: api.fcr,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

/**
 * Mapeia o formato plano da API de detalhe (GET por id) para Biometry.
 */
export function mapApiBiometryDetail(api: ApiBiometryDetail): Biometry {
  const raw = api as ApiBiometryDetail & { batcheId?: string; batcheName?: string };
  return {
    id: api.id,
    batchId: api.batchId ?? raw.batcheId ?? '',
    batchName: api.batchName ?? raw.batcheName ?? '',
    biometryDate: api.biometryDate,
    averageWeight: api.averageWeight,
    fcr: api.fcr,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function mapApiBiometryList(apiData: ApiBiometryListResponse): BiometryListResponse {
  const biometries: Biometry[] = (apiData.response ?? []).map(mapApiBiometry);
  return {
    biometries,
    total: apiData.pagination?.total ?? 0,
    page: apiData.pagination?.current_page ?? 1,
    limit: apiData.pagination?.per_page ?? 25,
  };
}
