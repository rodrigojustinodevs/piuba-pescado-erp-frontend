import type { CompanyListResponse, CreateCompanyData } from '@/features/company';
import type { ApiCompanyListResponse, Company } from '@/features/company/types';
import { mapCompanyPayload } from '@/features/company/mappers/companyPayload.mapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

interface ApiCompanyResponse {
  status: boolean;
  response: Company;
  message: string;
}

const CONTEXT = 'Companies API Proxy';

export const GET = createListGetHandler<ApiCompanyListResponse, CompanyListResponse>({
  backendPath: '/api/admin/companies',
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, {
      defaultLimit: 10,
    }),
  mapResponse: (apiData) => ({
    companies: apiData.response || [],
    total: apiData.pagination?.total || 0,
    page: apiData.pagination?.current_page || 1,
    limit: apiData.pagination?.per_page || 10,
  }),
});

export const POST = createUpsertHandler<ApiCompanyResponse, CreateCompanyData>({
  backendPath: '/api/admin/company',
  method: 'POST',
  context: CONTEXT,
  mapBody: mapCompanyPayload,
  mapResponse: (data) => data.response,
});
