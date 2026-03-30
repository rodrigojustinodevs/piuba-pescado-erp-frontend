import type {
  ApiNamedListResponse,
  SupplierListResponse,
  SupplyListResponse,
} from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

export function mapSupplierListResponse(apiData: ApiNamedListResponse): SupplierListResponse {
  const rows = extractListFromPagedApiResponse(apiData);
  return {
    suppliers: rows.map((r) => ({ id: r.id, name: r.name })),
    ...getApiPagedListMeta(apiData),
  };
}

export function mapSupplyListResponse(apiData: ApiNamedListResponse): SupplyListResponse {
  const rows = extractListFromPagedApiResponse(apiData);
  return {
    supplies: rows.map((r) => ({
      id: r.id,
      name: r.name,
      unit: r.unit?.trim() ? r.unit : 'unit',
    })),
    ...getApiPagedListMeta(apiData),
  };
}
