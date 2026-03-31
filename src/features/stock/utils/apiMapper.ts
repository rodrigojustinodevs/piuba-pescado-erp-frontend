import type { ApiStock, ApiStockListResponse, Stock, StockListResponse } from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

export function mapApiStock(api: ApiStock): Stock {
  return {
    id: api.id,
    companyId: api.companyId,
    supplyId: api.supplyId,
    supplierId: api.supplierId ?? null,
    supplyName: api.supply?.name ?? '-',
    supplierName: api.supplier?.name ?? null,
    currentQuantity: api.currentQuantity,
    unit: api.unit,
    unitPrice: api.unitPrice,
    minimumStock: api.minimumStock,
    withdrawalQuantity: api.withdrawalQuantity,
    isBelowMinimum: api.isBelowMinimum,
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt,
  };
}

export function mapApiStockList(apiData: ApiStockListResponse): StockListResponse {
  const rows = extractListFromPagedApiResponse(apiData);
  return {
    stocks: rows.map((row) => mapApiStock(row)),
    ...getApiPagedListMeta(apiData),
  };
}
