import type { ApiSale, ApiSaleListResponse, Sale, SaleListResponse } from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

export function mapApiSale(api: ApiSale): Sale {
  return {
    id: api.id,
    totalWeight: api.totalWeight,
    pricePerKg: api.pricePerKg,
    totalRevenue: api.totalRevenue,
    saleDate: api.saleDate,
    status: api.status,
    statusLabel: api.statusLabel,
    notes: api.notes ?? null,
    batchId: api.batchId ?? null,
    stockingId: api.stockingId ?? null,
    financialCategoryId:
      api.financialCategoryId ?? api.financial_category_id ?? null,
    isTotalHarvest: Boolean(api.isTotalHarvest ?? api.is_total_harvest),
    needsInvoice: Boolean(
      api.needsInvoice ?? api.needs_invoice ?? api.requiresInvoice ?? api.requires_invoice,
    ),
    companyName: api.company?.name ?? '',
    clientId: api.client?.id ?? null,
    clientName: api.client?.name ?? '',
    batchName: api.batch?.name ?? '',
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt ?? null,
  };
}

export function mapApiSaleList(apiData: ApiSaleListResponse): SaleListResponse {
  const sales = extractListFromPagedApiResponse(apiData).map(mapApiSale);
  return {
    sales,
    ...getApiPagedListMeta(apiData),
  };
}

