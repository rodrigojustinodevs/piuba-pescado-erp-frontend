import type { ApiPagination } from '@/shared/types/api';

export type StockLocationType = 'warehouse' | 'cold_room' | 'silo' | 'storage' | 'field';

export const STOCK_LOCATION_TYPE_LABELS: Record<StockLocationType, string> = {
  warehouse: 'Armazém',
  cold_room: 'Câmara Fria',
  silo: 'Silo',
  storage: 'Depósito',
  field: 'Campo',
};

export type StockLocationStatus = 'active' | 'inactive';

export const STOCK_LOCATION_STATUS_LABELS: Record<StockLocationStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
};

export type StockMovementType = 'inbound' | 'outbound' | 'adjustment' | 'transfer';

export type StockDialogMode = 'create' | 'edit' | 'view';

export interface StockLocation {
  id: string;
  companyId: string;
  code: string;
  name: string;
  type: StockLocationType;
  typeLabel: string;
  location: string;
  responsible: string | null;
  capacity: number | null;
  status: StockLocationStatus;
  statusLabel: string;
  notes: string | null;
  currentQuantity: number;
  totalValue: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiStockLocation {
  id: string;
  companyId: string;
  code: string;
  name: string;
  type: string;
  location: string;
  responsible?: string | null;
  capacity?: number | null;
  status?: string | null;
  notes?: string | null;
  currentQuantity?: number | null;
  totalValue?: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type ApiStockListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiStockLocation[] | { data?: ApiStockLocation[] };
  pagination?: ApiPagination;
};

export interface StockListResponse {
  stocks: StockLocation[];
  total: number;
  page: number;
  limit: number;
}

export interface StockCatalogStats {
  totalStocks: number;
  activeCount: number;
  inactiveCount: number;
  totalCapacity: number;
  totalItems: number;
}

export interface CreateStockLocationData {
  companyId?: string;
  code: string;
  name: string;
  type: StockLocationType;
  location: string;
  responsible?: string | null;
  capacity?: number | null;
  status: StockLocationStatus;
  notes?: string | null;
}

export interface UpdateStockLocationData extends CreateStockLocationData {
  id: string;
}

export interface CreateMovementData {
  type: StockMovementType;
  stockId: string;
  destStockId?: string;
  supplyId: string;
  quantity: number;
  reason: string;
  notes?: string;
}
