import type { SupplierListResponse, SupplyListResponse } from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

const LOOKUP_LIMIT = 500;

export const purchaseLookupService = {
  async listSuppliers(companyId?: string | null): Promise<SupplierListResponse> {
    const qs = buildQueryString(
      {
        page: 1,
        per_page: LOOKUP_LIMIT,
        ...(companyId?.trim() ? { company_id: companyId.trim() } : {}),
      },
      { skipEmptyString: true },
    );
    return browserHttpClient.get<SupplierListResponse>(`/api/company/suppliers?${qs}`);
  },

  async listSupplies(companyId?: string | null): Promise<SupplyListResponse> {
    const qs = buildQueryString(
      {
        page: 1,
        per_page: LOOKUP_LIMIT,
        ...(companyId?.trim() ? { company_id: companyId.trim() } : {}),
      },
      { skipEmptyString: true },
    );
    return browserHttpClient.get<SupplyListResponse>(`/api/company/supplies?${qs}`);
  },
};
