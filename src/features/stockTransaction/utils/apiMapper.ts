import type {
  ApiStockTransaction,
  ApiStockTransactionListResponse,
  StockTransaction,
  StockTransactionListResponse,
} from '../types';
import { getApiPagedListMeta } from '@/shared/utils/apiListResponse';

export function mapApiStockTransaction(api: ApiStockTransaction): StockTransaction {
  return {
    id: api.id,
    direction: api.direction,
    quantity: api.quantity,
    unit: api.unit,
    unitPrice: api.unitPrice,
    totalCost: api.totalCost,
    referenceType: api.referenceType,
    referenceId: api.referenceId,
    createdAt: api.createdAt,
  };
}

function extractRows(apiData: ApiStockTransactionListResponse): ApiStockTransaction[] {
  const r = apiData.response;
  if (Array.isArray(r)) return r;
  if (r && typeof r === 'object' && 'data' in r && Array.isArray(r.data)) return r.data;
  return [];
}

export function mapApiStockTransactionList(
  apiData: ApiStockTransactionListResponse,
): StockTransactionListResponse {
  const rows = extractRows(apiData);
  return {
    transactions: rows.map(mapApiStockTransaction),
    ...getApiPagedListMeta(apiData),
  };
}
