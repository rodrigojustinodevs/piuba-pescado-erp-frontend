import type { ApiSale, CreateSaleData } from '@/features/sale/types';
import { mapApiSale } from '@/features/sale/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Sale API Proxy';

type ApiSaleCreateResponse = { response?: ApiSale } | ApiSale;

export const POST = createUpsertHandler<ApiSaleCreateResponse, CreateSaleData>({
  backendPath: '/api/company/sale',
  method: 'POST',
  context: CONTEXT,
  mapBody: (payload) => ({
    clientId: payload.clientId,
    batchId: payload.batchId,
    stockingId: payload.stockingId,
    financialCategoryId: payload.financialCategoryId,
    totalWeight: payload.totalWeight,
    pricePerKg: payload.pricePerKg,
    saleDate: payload.saleDate,
    isTotalHarvest: payload.isTotalHarvest,
    needsInvoice: payload.needsInvoice,
    status: payload.status,
    notes: payload.notes?.trim() ? payload.notes.trim() : null,
  }),
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiSale(api as ApiSale);
  },
});

