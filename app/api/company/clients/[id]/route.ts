import type { ApiClient, Client, UpdateClientData } from '@/features/client/types';
import { mapApiClient } from '@/features/client/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Clients API Proxy';

type ApiClientDetailEnvelope = { response?: ApiClient } | ApiClient;

function mapDetailResponse(data: ApiClientDetailEnvelope): Client {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiClient(api as ApiClient);
}

export const GET = createDetailGetHandler<ApiClientDetailEnvelope, Client, { id: string }>({
  backendPathBuilder: (params) => `/api/company/client/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<ApiClientDetailEnvelope, UpdateClientData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/client/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => {
    const { id, ...rest } = payload;
    void id;
    const body = {
      company_id: rest.companyId?.trim() ? rest.companyId.trim() : undefined,
      name: rest.name.trim(),
      person_type: rest.personType,
      document_number: rest.documentNumber?.trim() ? rest.documentNumber.trim() : null,
      email: rest.email?.trim() ? rest.email.trim() : null,
      phone: rest.phone?.trim() ? rest.phone.trim() : null,
      contact: rest.contact?.trim() ? rest.contact.trim() : null,
      address: rest.address?.trim() ? rest.address.trim() : null,
      credit_limit: rest.creditLimit ?? null,
      price_group: rest.priceGroup,
    };
    if (body.company_id) return body;
    const { company_id, ...withoutCompanyId } = body;
    void company_id;
    return withoutCompanyId;
  },
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/client/${params.id}`,
  context: CONTEXT,
});

