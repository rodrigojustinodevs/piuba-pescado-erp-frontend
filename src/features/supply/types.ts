import type { ApiPagination } from '@/shared/types/api';

export type SupplyCategory =
  | 'feed'
  | 'medication'
  | 'fertilizer'
  | 'probiotic'
  | 'equipment'
  | 'packaging'
  | 'finished_product'
  | 'other';

export type SupplyStatus = 'active' | 'inactive' | 'low_stock';

export const CATEGORY_LABELS: Record<SupplyCategory, string> = {
  feed: 'Ração',
  medication: 'Medicamento',
  fertilizer: 'Fertilizante',
  probiotic: 'Probiótico',
  equipment: 'Equipamento',
  packaging: 'Embalagem',
  finished_product: 'Produto Acabado',
  other: 'Outro',
};

export const STATUS_LABELS: Record<SupplyStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  low_stock: 'Estoque Baixo',
};

export interface Supply {
  id: string;
  companyId: string;
  sku: string | null;
  name: string;
  category: string | null;
  categoryLabel: string | null;
  defaultUnit: string;
  unitCost: number;
  salePrice: number;
  currentStock: number;
  minStock: number;
  supplierId: string | null;
  supplierName: string | null;
  isProduct: boolean;
  status: SupplyStatus;
  statusLabel: string;
  description: string | null;
  companyName: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiSupply {
  id: string;
  companyId: string;
  sku: string | null;
  name: string;
  category: string | null;
  categoryLabel?: string | null;
  unit?: string | null;
  unitCost?: number | null;
  salePrice?: number | null;
  currentStock?: number | null;
  minStock?: number | null;
  supplier?: { id: string; name: string } | null;
  isProduct?: boolean | null;
  status?: SupplyStatus | null;
  statusLabel?: string | null;
  description?: string | null;
  company?: { name: string } | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type ApiSupplyListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiSupply[] | { data?: ApiSupply[] };
  pagination?: ApiPagination;
};

export interface SupplyListResponse {
  supplies: Supply[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSupplyData {
  companyId?: string;
  sku?: string | null;
  name: string;
  category: string | null;
  defaultUnit: string;
  supplierId?: string | null;
  unitCost: number;
  salePrice: number;
  currentStock: number;
  minStock: number;
  isProduct: boolean;
  description?: string | null;
}

export interface UpdateSupplyData extends CreateSupplyData {
  id: string;
}

export type SupplyDialogMode = 'create' | 'edit' | 'view';

export type EnrichedSupply = Supply;

export interface SupplyCatalogStats {
  totalItems: number;
  belowMinimumCount: number;
  totalStockValue: number;
}
