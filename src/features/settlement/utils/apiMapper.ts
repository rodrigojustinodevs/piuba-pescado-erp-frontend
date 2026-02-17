import type {
  ApiSettlementListResponse,
  ApiSettlementResponse,
  Settlement,
  SettlementListResponse,
} from '../types';

export function mapApiSettlement(apiData: ApiSettlementResponse): Settlement {
  return apiData.response;
}

export function mapApiSettlementList(apiData: ApiSettlementListResponse): SettlementListResponse {
  const settlements: Settlement[] = apiData.response ?? [];

  return {
    settlements,
    total: apiData.pagination?.total ?? 0,
    page: apiData.pagination?.current_page ?? 1,
    limit: apiData.pagination?.per_page ?? 25,
  };
}
