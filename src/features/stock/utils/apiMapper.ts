import type {
  ApiStockLocation,
  ApiStockListResponse,
  StockLocation,
  StockListResponse,
  StockLocationType,
  StockLocationStatus,
} from '../types';
import { STOCK_LOCATION_TYPE_LABELS, STOCK_LOCATION_STATUS_LABELS } from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

export function mapApiStockLocation(api: ApiStockLocation): StockLocation {
  const type = (api.type as StockLocationType) || 'deposito';
  const status = (api.status as StockLocationStatus) || 'active';
  return {
    id: api.id,
    companyId: api.companyId,
    code: api.code,
    name: api.name,
    type,
    typeLabel: STOCK_LOCATION_TYPE_LABELS[type] ?? api.type,
    location: api.location,
    responsible: api.responsible ?? null,
    capacity: api.capacity ?? null,
    status,
    statusLabel: STOCK_LOCATION_STATUS_LABELS[status] ?? api.status ?? '',
    notes: api.notes ?? null,
    currentQuantity: api.currentQuantity ?? 0,
    totalValue: api.totalValue ?? 0,
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt ?? null,
  };
}

export function mapApiStockList(apiData: ApiStockListResponse): StockListResponse {
  const rows = extractListFromPagedApiResponse(apiData);
  return {
    stocks: rows.map((row) => mapApiStockLocation(row)),
    ...getApiPagedListMeta(apiData),
  };
}

// Keep old export names as aliases for backward compatibility with API route files
export { mapApiStockLocation as mapApiStock };
