/**
 * Tipos relacionados à entidade Stock (Estoque)
 */

import type { ApiPagination } from '@/shared/types/api';

export interface Stock {
  id: string;
  companyId: string;
  supplyId: string;
  supplierId: string | null;
  supplyName: string;
  supplierName: string | null;
  currentQuantity: number;
  unit: string;
  unitPrice: number;
  minimumStock: number;
  withdrawalQuantity: number;
  isBelowMinimum: boolean;
  createdAt: string | null;
  updatedAt: string;
}

export interface ApiStock {
  id: string;
  companyId: string;
  supplyId: string;
  supplierId: string | null;
  currentQuantity: number;
  unit: string;
  unitPrice: number;
  minimumStock: number;
  withdrawalQuantity: number;
  isBelowMinimum: boolean;
  createdAt: string | null;
  updatedAt: string;
  supply?: {
    id: string;
    name: string;
    defaultUnit?: string | null;
  } | null;
  supplier?: {
    id: string;
    name: string;
  } | null;
}

export type ApiStockListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiStock[] | { data?: ApiStock[] };
  pagination?: ApiPagination;
};

export interface StockListResponse {
  stocks: Stock[];
  total: number;
  page: number;
  limit: number;
}

/** Payload de criação (POST /api/company/stock). `companyId` só para Master. */
export interface CreateStockData {
  companyId?: string;
  supplierId: string;
  supplyId: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  unitPrice: number;
}

/** Campos permitidos no PUT /api/company/stock/:id */
export interface UpdateStockPayload {
  unit: string;
  supplierId: string | null;
  unitPrice: number;
  minimumStock: number;
  withdrawalQuantity: number;
}

export interface UpdateStockData extends UpdateStockPayload {
  id: string;
}

export interface AdjustStockPayload {
  physicalQuantity: number;
  reason: string;
}
