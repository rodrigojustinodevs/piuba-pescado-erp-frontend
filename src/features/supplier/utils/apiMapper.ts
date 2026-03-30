import type {
  ApiSupplier,
  ApiSupplierListResponse,
  Supplier,
  SupplierListResponse,
} from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

export function mapApiSupplier(api: ApiSupplier): Supplier {
  return {
    id: api.id,
    companyId: api.companyId,
    name: api.name,
    contact: api.contact ?? null,
    phone: api.phone ?? null,
    email: api.email ?? null,
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
