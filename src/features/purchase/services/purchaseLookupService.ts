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
    const raw = await browserHttpClient.get<any>(`/api/company/suppliers?${qs}`);
    const suppliers = (raw?.suppliers ?? []).map((s: any) => ({
      id: s.id,
      name: s.name,
      document: s.cnpj ?? s.document ?? undefined,
    }));
    return {
      suppliers,
      total: raw?.total ?? suppliers.length,
      page: raw?.page ?? 1,
      limit: raw?.limit ?? LOOKUP_LIMIT,
    };
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
        unitCost: s.unitCost ?? undefined,
        sku: s.sku ?? undefined,
        category: s.categoryLabel ?? s.category ?? null,
      })),
      total: full.total,
      page: full.page,
      limit: full.limit,
    };
  },
};
