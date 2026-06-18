import type {
  ApiClient,
  ApiClientListResponse,
  Client,
  ClientListResponse,
  ClientStatus,
} from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

function deriveStatus(api: ApiClient): ClientStatus {
  if (api.status) return api.status;
  if (api.isDefaulter) return 'inactive';
  return 'active';
}

export function mapApiClient(api: ApiClient): Client {
  return {
    id: api.id,
    companyId: api.companyId ?? '',
    name: api.name,
    tradeName: api.tradeName ?? null,
    personType: api.personType,
    documentNumber: api.documentNumber ?? null,
    email: api.email ?? null,
    phone: api.phone ?? null,
    contact: api.contact ?? null,
    city: api.city ?? null,
    state: api.state ?? null,
    address: api.address ?? null,
    creditLimit: api.creditLimit ?? null,
    purchaseTotal: api.purchaseTotal ?? 0,
    isDefaulter: !!api.isDefaulter,
    status: deriveStatus(api),
    priceGroup: api.priceGroup,
    notes: api.notes ?? null,
    companyName: api.company?.name ?? '',
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt ?? null,
  };
}

export function mapApiClientList(apiData: ApiClientListResponse): ClientListResponse {
  const clients = extractListFromPagedApiResponse(apiData).map(mapApiClient);
  return {
    clients,
    ...getApiPagedListMeta(apiData),
  };
}
