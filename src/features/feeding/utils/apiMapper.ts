import type { ApiFeeding, ApiFeedingListResponse, Feeding, FeedingListResponse } from '../types';

/** Formato plano retornado pela API no GET por id (sem objeto batch). */
export type ApiFeedingDetail = {
  id: string;
  batchId: string;
  feedingDate: string;
  quantityProvided: number;
  feedType: string;
  stockReductionQuantity: number;
  createdAt: string | null;
  updatedAt: string;
  batchName?: string;
};

export function mapApiFeeding(api: ApiFeeding): Feeding {
  return {
    id: api.id,
    batchId: api.batch?.id ?? '',
    batchName: api.batch?.name ?? '',
    feedingDate: api.feedingDate,
    quantityProvided: api.quantityProvided,
    feedType: api.feedType,
    stockReductionQuantity: api.stockReductionQuantity,
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt,
  };
}

export function mapApiFeedingDetail(api: ApiFeedingDetail): Feeding {
  return {
    id: api.id,
    batchId: api.batchId ?? '',
    batchName: api.batchName ?? '',
    feedingDate: api.feedingDate,
    quantityProvided: api.quantityProvided,
    feedType: api.feedType,
    stockReductionQuantity: api.stockReductionQuantity,
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt,
  };
}

export function mapApiFeedingList(apiData: ApiFeedingListResponse): FeedingListResponse {
  const feedings: Feeding[] = (apiData.response ?? []).map(mapApiFeeding);
  return {
    feedings,
    total: apiData.pagination?.total ?? 0,
    page: apiData.pagination?.current_page ?? 1,
    limit: apiData.pagination?.per_page ?? 25,
  };
}
