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
    saleDate: payload.saleDate,
    financialCategoryId: payload.financialCategoryId,
    responsibleUserId: payload.responsibleUserId,
    dueDate: payload.dueDate,
    status: payload.status,
    notes: payload.notes?.trim() ? payload.notes.trim() : null,
    needsInvoice: payload.needsInvoice,
    invoiceNumber: payload.invoiceNumber,
    discount: payload.discount,
    shipping: payload.shipping,
    taxes: payload.taxes,
    paymentMethod: payload.paymentMethod,
    items: payload.items,
  }),
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiSale(api as ApiSale);
  },
});
