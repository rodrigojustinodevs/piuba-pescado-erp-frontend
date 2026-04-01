import type { ApiSupply, ApiSupplyListResponse, Supply, SupplyListResponse } from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

export function mapApiSupply(api: ApiSupply): Supply {
  return {
    id: api.id,
    companyId: api.companyId,
    name: api.name,
    category: api.category ?? null,
    defaultUnit: api.defaultUnit,
    companyName: api.company?.name ?? '',
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt ?? null,
  };
}

export function mapApiSupplyList(apiData: ApiSupplyListResponse): SupplyListResponse {
  const supplies = extractListFromPagedApiResponse(apiData).map(mapApiSupply);
  return {
    supplies,
    ...getApiPagedListMeta(apiData),
  };
}

