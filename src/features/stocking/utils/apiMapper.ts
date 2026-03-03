import type {
  ApiStockingListResponse,
  ApiStockingResponse,
  Stocking,
  StockingListResponse,
  StockingApiItem,
} from '../types';

function mapApiItemToStocking(item: StockingApiItem): Stocking {
  const batchId = item.batch?.id ?? item.batchId ?? (item as { batcheId?: string }).batcheId ?? '';
  const batchName = item.batch?.name;
  return {
    id: item.id,
    batchId,
    batchName,
    stockingDate: item.stockingDate ?? item.settlementDate ?? '',
    quantity: item.quantity,
    averageWeight: item.averageWeight,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export function mapApiStocking(apiData: ApiStockingResponse): Stocking {
  return mapApiItemToStocking(apiData.response);
}

export function mapApiStockingList(apiData: ApiStockingListResponse): StockingListResponse {
  const items: StockingApiItem[] = apiData.response ?? [];
  const stockings: Stocking[] = items.map(mapApiItemToStocking);

  return {
    stockings,
    total: apiData.pagination?.total ?? 0,
    page: apiData.pagination?.current_page ?? 1,
    limit: apiData.pagination?.per_page ?? 25,
  };
}
