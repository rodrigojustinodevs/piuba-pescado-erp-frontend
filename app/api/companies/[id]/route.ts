import type { UpdateCompanyData } from '@/features/company';
import type { Company } from '@/features/company/types';
import { mapCompanyPayload } from '@/features/company/mappers/companyPayload.mapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

interface ApiCompanyResponse {
  status: boolean;
  response: Company;
  message: string;
}

const CONTEXT = 'Company By Id API Proxy';

export const GET = createDetailGetHandler<ApiCompanyResponse, Company, { id: string }>({
  backendPathBuilder: ({ id }) => `/api/admin/company/${id}`,
  context: CONTEXT,
  mapResponse: (data) => data.response,
});

export const PUT = createPutHandler<
  ApiCompanyResponse,
  Omit<UpdateCompanyData, 'id'>,
  { id: string }
>({
  backendPathBuilder: ({ id }) => `/api/admin/company/${id}`,
  context: CONTEXT,
  mapBody: mapCompanyPayload,
  mapResponse: (data) => data.response,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: ({ id }) => `/api/admin/company/${id}`,
  context: CONTEXT,
});
