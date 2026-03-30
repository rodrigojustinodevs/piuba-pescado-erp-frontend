import type {
  ApiPurchase,
  ApiPurchaseItem,
  ApiPurchaseListResponse,
  Purchase,
  PurchaseItem,
  PurchaseListResponse,
} from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

function mapApiPurchaseItem(api: ApiPurchaseItem): PurchaseItem {
  return {
    id: api.id,
    supplyId: api.supplyId,
    supplyName: api.supplyName,
    quantity: api.quantity,
    unit: api.unit,
    unitPrice: api.unitPrice,
    totalPrice: api.totalPrice,
  };
}

export function mapApiPurchase(api: ApiPurchase): Purchase {
  return {
    id: api.id,
    companyId: api.companyId,
    supplierId: api.supplierId,
    invoiceNumber: api.invoiceNumber ?? null,
    totalPrice: api.totalPrice,
    status: api.status,
    purchaseDate: api.purchaseDate,
    receivedAt: api.receivedAt ?? null,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    companyName: api.company?.name ?? '',
    supplierName: api.supplier?.name ?? '',
    items: (api.items ?? []).map(mapApiPurchaseItem),
  };
}

export function mapApiPurchaseList(apiData: ApiPurchaseListResponse): PurchaseListResponse {
  const purchases: Purchase[] = extractListFromPagedApiResponse(apiData).map(mapApiPurchase);
  return {
    purchases,
    ...getApiPagedListMeta(apiData),
  };
}
