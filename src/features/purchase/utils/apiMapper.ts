import type {
  ApiPurchase,
  ApiPurchaseItem,
  ApiPurchaseListResponse,
  ApiPurchasePayment,
  Purchase,
  PurchaseItem,
  PurchaseListResponse,
  PurchasePayment,
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
    receivedQuantity: api.receivedQuantity ?? 0,
  };
}

export function mapApiPurchasePayment(api: ApiPurchasePayment): PurchasePayment {
  return {
    id: api.id,
    purchaseId: api.purchaseId,
    amount: api.amount,
    paymentDate: api.paymentDate,
    paymentMethod: api.paymentMethod,
    reference: api.reference ?? null,
    notes: api.notes ?? null,
    createdAt: api.createdAt,
  };
}

export function mapApiPurchase(api: ApiPurchase): Purchase {
  return {
    id: api.id,
    referenceCode: api.code,
    companyId: api.companyId,
    supplierId: api.supplierId,
    invoiceNumber: api.invoiceNumber ?? null,
    totalPrice: api.totalPrice,
    freightCost: api.freight ?? 0,
    otherCosts: api.otherCosts ?? 0,
    status: api.status,
    paymentStatus: api.paymentStatus ?? 'pending',
    paymentMethod: api.paymentMethod ?? null,
    orderDate: api.orderDate,
    expectedDeliveryDate: api.expectedDate ?? null,
    receivedAt: api.receivedDate ?? null,
    notes: api.notes ?? null,
    responsibleName: api.responsible ?? null,
    paidAmount: api.paidAmount ?? 0,
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
