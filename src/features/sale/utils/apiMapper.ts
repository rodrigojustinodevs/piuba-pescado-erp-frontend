import type { ApiSale, ApiSaleItem, ApiSaleListResponse, Sale, SaleItem, SaleListResponse } from '../types';
import type { UpdateSaleFormData } from '../schemas';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

function mapApiSaleItem(item: ApiSaleItem): SaleItem {
  return {
    batchId: item.batchId ?? item.batch?.id ?? item.batch_id ?? null,
    stockingId: item.stockingId ?? item.stocking?.id ?? item.stocking_id ?? null,
    totalWeight: item.totalWeight,
    pricePerKg: item.pricePerKg,
    isTotalHarvest: Boolean(item.isTotalHarvest ?? item.is_total_harvest),
    category: item.category ?? null,
    notes: item.notes ?? null,
  };
}

export function mapApiSale(api: ApiSale): Sale {
  const items: SaleItem[] =
    api.items && api.items.length > 0
      ? api.items.map(mapApiSaleItem)
      : [
          {
            batchId: api.batchId ?? api.batch?.id ?? null,
            stockingId: api.stockingId ?? api.stocking?.id ?? api.stocking_id ?? null,
            totalWeight: api.totalWeight,
            pricePerKg: api.pricePerKg,
            isTotalHarvest: Boolean(api.isTotalHarvest ?? api.is_total_harvest),
            category: null,
            notes: api.notes ?? null,
          },
        ];

  return {
    id: api.id,
    code: api.code ?? null,
    totalWeight: api.totalWeight,
    pricePerKg: api.pricePerKg,
    totalRevenue: api.totalRevenue,
    saleDate: api.saleDate,
    dueDate: api.dueDate ?? api.due_date ?? null,
    paymentMethod: api.paymentMethod ?? api.payment_method ?? null,
    status: api.status,
    statusLabel: api.statusLabel,
    numberNf: api.invoiceNumber ?? api.number_nf ?? null,
    notes: api.notes ?? null,
    batchId: api.batchId ?? api.batch?.id ?? null,
    stockingId: api.stockingId ?? api.stocking?.id ?? api.stocking_id ?? null,
    financialCategoryId: api.financialCategoryId ?? api.financial_category_id ?? null,
    isTotalHarvest: Boolean(api.isTotalHarvest ?? api.is_total_harvest),
    needsInvoice: Boolean(
      api.needsInvoice ?? api.needs_invoice ?? api.requiresInvoice ?? api.requires_invoice,
    ),
    companyName: api.company?.name ?? '',
    clientId: api.client?.id ?? null,
    clientName: api.client?.name ?? '',
    batchName: api.batch?.name ?? '',
    discount: api.discount ?? 0,
    shipping: api.shipping ?? 0,
    taxes: api.taxes ?? 0,
    items,
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt ?? null,
  };
}

export function saleToUpdateFormValues(sale: Sale): UpdateSaleFormData {
  return {
    clientId: sale.clientId ?? '',
    financialCategoryId: sale.financialCategoryId ?? '',
    needsInvoice: sale.needsInvoice ?? false,
    invoiceNumber: sale.numberNf ?? '',
    status: sale.status ?? 'pending',
    paymentMethod: sale.paymentMethod ?? '',
    saleDate: sale.saleDate.slice(0, 10),
    dueDate: sale.dueDate ?? '',
    items: sale.items.map((item) => ({
      batchId: item.batchId ?? '',
      stockingId: item.stockingId ?? '',
      totalWeight: item.totalWeight,
      pricePerKg: item.pricePerKg,
      isTotalHarvest: item.isTotalHarvest,
      category: item.category ?? '',
      notes: item.notes ?? '',
    })),
    discount: sale.discount,
    shipping: sale.shipping,
    taxes: sale.taxes,
    notes: sale.notes ?? '',
  };
}

export function mapApiSaleList(apiData: ApiSaleListResponse): SaleListResponse {
  const sales = extractListFromPagedApiResponse(apiData).map(mapApiSale);
  return {
    sales,
    ...getApiPagedListMeta(apiData),
  };
}
