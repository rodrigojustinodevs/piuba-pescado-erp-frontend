import type {
  ApiFinancialCategory,
  ApiFinancialCategoryListResponse,
  FinancialCategory,
  FinancialCategoryListResponse,
} from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';
import { labelFinancialCategoryStatus, labelFinancialCategoryType } from './labels';

function defaultTypeLabel(type: string): string {
  return labelFinancialCategoryType(type);
}

function defaultStatusLabel(status: string): string {
  return labelFinancialCategoryStatus(status);
}

export function mapApiFinancialCategory(api: ApiFinancialCategory): FinancialCategory {
  return {
    id: api.id,
    name: api.name,
    type: api.type,
    typeLabel: api.typeLabel ?? defaultTypeLabel(api.type),
    status: api.status,
    statusLabel: api.statusLabel ?? defaultStatusLabel(api.status),
    companyId: api.company?.id ?? '',
    companyName: api.company?.name ?? '',
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt ?? null,
  };
}

export function mapApiFinancialCategoryList(
  apiData: ApiFinancialCategoryListResponse,
): FinancialCategoryListResponse {
  const financialCategories = extractListFromPagedApiResponse(apiData).map(mapApiFinancialCategory);
  return {
    financialCategories,
    ...getApiPagedListMeta(apiData),
  };
}
