import type { SupplierListResponse, SupplyListResponse } from '../types';
import type { SupplyListResponse as SupplyFeatureListResponse } from '@/features/supply/types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

const LOOKUP_LIMIT = 500;

export const purchaseLookupService = {
  async listSuppliers(companyId?: string | null): Promise<SupplierListResponse> {
    const qs = buildQueryString(
      {
        page: 1,
        perPage: LOOKUP_LIMIT,
        ...(companyId?.trim() ? { companyId: companyId.trim() } : {}),
      },
      { skipEmptyString: true },
    );
    return browserHttpClient.get<SupplierListResponse>(`/api/company/suppliers?${qs}`);
  },

  async listSupplies(companyId?: string | null): Promise<SupplyListResponse> {
    const qs = buildQueryString(
      {
        page: 1,
        perPage: LOOKUP_LIMIT,
        ...(companyId?.trim() ? { companyId: companyId.trim() } : {}),
      },
      { skipEmptyString: true },
    );
    const full = await browserHttpClient.get<SupplyFeatureListResponse>(
      `/api/company/supplies?${qs}`,
    );
    return {
      supplies: (full.supplies ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        unit: s.defaultUnit?.trim() ? s.defaultUnit : 'unit',
      })),
      total: full.total,
      page: full.page,
      limit: full.limit,
    };
  },
};
