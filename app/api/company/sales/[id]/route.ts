import type { ApiSale, Sale, UpdateSaleData } from '@/features/sale/types';
import { mapApiSale } from '@/features/sale/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Sale detail API Proxy';

type ApiSaleDetailEnvelope = { response?: ApiSale } | ApiSale;

function mapDetailResponse(data: ApiSaleDetailEnvelope): Sale {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiSale(api as ApiSale);
}

export const GET = createDetailGetHandler<ApiSaleDetailEnvelope, Sale, { id: string }>({
  backendPathBuilder: (params) => `/api/company/sale/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<ApiSaleDetailEnvelope, UpdateSaleData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/sale/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => ({
    clientId: payload.clientId,
    financialCategoryId: payload.financialCategoryId,
    responsibleUserId: payload.responsibleUserId,
    needsInvoice: payload.needsInvoice,
    invoiceNumber: payload.invoiceNumber,
    status: payload.status,
    paymentMethod: payload.paymentMethod,
    saleDate: payload.saleDate,
    dueDate: payload.dueDate,
    items: payload.items,
    discount: payload.discount,
    shipping: payload.shipping,
    taxes: payload.taxes,
    notes: payload.notes?.trim() ? payload.notes.trim() : null,
  }),
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/sale/${params.id}`,
  context: CONTEXT,
});
