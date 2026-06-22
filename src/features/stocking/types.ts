import type { ApiListResponse, ApiResponse } from '@/shared/types/api';

export interface Stocking {
  id: string;
  batchId: string;
  /** Nome do lote quando vindo da API (ex.: listagem com batch aninhado) */
  batchName?: string;
  stockingDate: string;
  quantity: number;
  averageWeight: number;
  createdAt: string;
  updatedAt: string;
}

/** Formato do item retornado pela API (com batch aninhado ou campos flat) */
export interface StockingApiItem {
  id: string;
  batch?: { id: string; name: string };
  batchId?: string;
  batcheId?: string;
  stockingDate?: string;
  settlementDate?: string;
  quantity: number;
  averageWeight: number;
  createdAt: string;
  updatedAt: string;
}

export type ApiStockingResponse = ApiResponse<StockingApiItem>;
export type ApiStockingListResponse = ApiListResponse<StockingApiItem>;

export interface StockingListResponse {
  stockings: Stocking[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateStockingData {
  batchId: string;
  stockingDate: string;
  quantity: number;
  averageWeight: number;
}

export interface UpdateStockingData extends CreateStockingData {
  id: string;
}

export type StockingDialogMode = 'create' | 'edit' | 'view';
