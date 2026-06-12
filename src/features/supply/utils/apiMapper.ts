import type { ApiSupply, ApiSupplyListResponse, Supply, SupplyListResponse } from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

export function mapApiSupply(api: ApiSupply): Supply {
  return {
    id: api.id,
    companyId: api.companyId,
    sku: api.sku ?? null,
    name: api.name,
    category: api.category ?? null,
    categoryLabel: api.categoryLabel ?? null,
    defaultUnit: api.unit ?? '',
    unitCost: api.unitCost ?? 0,
    salePrice: api.salePrice ?? 0,
    currentStock: api.currentStock ?? 0,
    minStock: api.minStock ?? 0,
    supplierId: api.supplier?.id ?? null,
    supplierName: api.supplier?.name ?? null,
    isProduct: api.isProduct ?? false,
    status: api.status ?? 'active',
    statusLabel: api.statusLabel ?? 'Ativo',
    description: api.description ?? null,
    companyName: api.company?.name ?? '',
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt ?? null,
  };
}

export function mapApiSupplyList(apiData: ApiSupplyListResponse): SupplyListResponse {
  const supplies = extractListFromPagedApiResponse(apiData).map(mapApiSupply);
  return {
    supplies,
    ...getApiPagedListMeta(apiData),
  };
}
