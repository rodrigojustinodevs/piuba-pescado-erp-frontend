import type {
  ApiSupplier,
  ApiSupplierListResponse,
  Supplier,
  SupplierListResponse,
} from '../types';
import { STATUS_LABELS, CATEGORY_LABELS } from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

export function mapApiSupplier(api: ApiSupplier): Supplier {
  const status = api.status ?? 'active';
  return {
    id: api.id,
    companyId: api.companyId,
    name: api.name,
    tradeName: api.tradeName ?? null,
    document: api.document ?? null,
    stateRegistration: api.stateRegistration ?? null,
    contact: api.contact ?? null,
    contactName: api.contactName ?? null,
    phone: api.phone ?? null,
    email: api.email ?? null,
    category: api.category ?? null,
    categoryLabel: api.categoryLabel ?? (api.category ? CATEGORY_LABELS[api.category] : null),
    paymentTerms: api.paymentTerms ?? null,
    rating: api.rating ?? null,
    address: {
      street: api.address?.street ?? null,
      number: api.address?.number ?? null,
      complement: api.address?.complement ?? null,
      neighborhood: api.address?.neighborhood ?? null,
      city: api.address?.city ?? null,
      state: api.address?.state ?? null,
      zipCode: api.address?.zipCode ?? null,
    },
    status,
    statusLabel: api.statusLabel ?? STATUS_LABELS[status],
    totalPurchases: 0,
    lastPurchaseAt: null,
    companyName: api.company?.name ?? '',
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt ?? null,
  };
}

export function mapApiSupplierList(apiData: ApiSupplierListResponse): SupplierListResponse {
  const suppliers: Supplier[] = extractListFromPagedApiResponse(apiData).map(mapApiSupplier);
  return {
    suppliers,
    ...getApiPagedListMeta(apiData),
  };
}
