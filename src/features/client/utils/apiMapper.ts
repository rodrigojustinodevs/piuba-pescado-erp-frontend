import type { ApiClient, ApiClientListResponse, Client, ClientListResponse } from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

export function mapApiClient(api: ApiClient): Client {
  return {
    id: api.id,
    companyId: api.companyId ?? '',
    name: api.name,
    personType: api.personType,
    documentNumber: api.documentNumber ?? null,
    email: api.email ?? null,
    phone: api.phone ?? null,
    contact: api.contact ?? null,
    address: api.address ?? null,
    creditLimit: api.creditLimit ?? null,
    isDefaulter: !!api.isDefaulter,
    priceGroup: api.priceGroup,
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

