import type { ApiFeeding, ApiFeedingListResponse, Feeding, FeedingListResponse } from '../types';

/** Formato plano retornado pela API no GET por id (sem objeto batch). */
export type ApiFeedingDetail = {
  id: string;
  feedingDate: string;
  quantityProvided: number;
  feedType: string;
  stock?: { id: string; name: string };
  stockReductionQuantity: number;
  batch?: { id: string; name: string };
  createdAt: string | null;
  updatedAt: string;
};

export function mapApiFeeding(api: ApiFeeding): Feeding {
  return {
    id: api.id,
    batch: api.batch ?? { id: '', name: '' },
    feedingDate: api.feedingDate,
    quantityProvided: api.quantityProvided,
    feedType: api.feedType,
    stock: api.stock ?? { id: '', name: '' },
    stockReductionQuantity: api.stockReductionQuantity,
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt,
  };
}

export function mapApiFeedingDetail(api: ApiFeedingDetail): Feeding {
  return {
    id: api.id,
    feedingDate: api.feedingDate,
    batch: api.batch ?? { id: '', name: '' },
    quantityProvided: api.quantityProvided,
    feedType: api.feedType,
    stock: api.stock ?? { id: '', name: '' },
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
