import type { ApiClient, CreateClientData } from '@/features/client/types';
import { mapApiClient } from '@/features/client/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Client API Proxy';

type ApiClientCreateResponse = { response?: ApiClient } | ApiClient;

export const POST = createUpsertHandler<ApiClientCreateResponse, CreateClientData>({
  backendPath: '/api/company/client',
  method: 'POST',
  context: CONTEXT,
  mapBody: (payload) => {
    const body = {
      company_id: payload.companyId?.trim() ? payload.companyId.trim() : undefined,
      name: payload.name.trim(),
      person_type: payload.personType,
      document_number: payload.documentNumber?.trim() ? payload.documentNumber.trim() : null,
      email: payload.email?.trim() ? payload.email.trim() : null,
      phone: payload.phone?.trim() ? payload.phone.trim() : null,
      contact: payload.contact?.trim() ? payload.contact.trim() : null,
      address: payload.address?.trim() ? payload.address.trim() : null,
      credit_limit: payload.creditLimit ?? null,
      price_group: payload.priceGroup,
    };
    if (body.company_id) return body;
    const { company_id, ...rest } = body;
    void company_id;
    return rest;
  },
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiClient(api as ApiClient);
  },
});

