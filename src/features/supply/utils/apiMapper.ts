import type {
  ApiSupply,
  ApiSupplyListResponse,
  CreateSupplyData,
  Supply,
  SupplyListResponse,
  UpdateSupplyData,
} from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

type SupplyBody = {
  name: string;
  sku: string | null;
  category: string | null;
  unit: string;
  unit_cost: number;
  sale_price: number;
  current_stock: number;
  min_stock: number;
  supplier_id: string | undefined;
  is_product: boolean;
  description: string | null;
  companyId?: string;
};

export function buildSupplyBody(payload: CreateSupplyData | UpdateSupplyData): SupplyBody {
  const category = payload.category?.trim() ? payload.category.trim() : null;
  const sku = payload.sku?.trim() ? payload.sku.trim() : null;
  const description = payload.description?.trim() ? payload.description.trim() : null;
  return {
    name: payload.name.trim(),
    sku,
    category,
    unit: payload.defaultUnit.trim(),
    unit_cost: payload.unitCost,
    sale_price: payload.salePrice,
    current_stock: payload.currentStock,
    min_stock: payload.minStock,
    supplier_id: payload.supplierId?.trim() || undefined,
    is_product: payload.isProduct,
    description,
    ...(payload.companyId?.trim() ? { companyId: payload.companyId.trim() } : {}),
  };
}

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
