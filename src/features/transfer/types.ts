import type { ApiListResponse, ApiResponse } from '@/shared/types/api';

/**
 * Modelo interno usado no frontend (flattened).
 */
export interface Transfer {
  id: string;
  batchId: string;
  batchName?: string;
  originTankId: string;
  originTankName?: string;
  destinationTankId: string;
  destinationTankName?: string;
  quantity: number;
  description: string;
  createdAt: string | null;
  updatedAt: string | null;
}

/**
 * Formato retornado pela API no endpoint de transferências
 * (com batch/originTank/destinationTank aninhados).
 */
export interface ApiTransferItem {
  id: string;
  batch: {
    id: string;
    name: string;
  };
  originTank: {
    id: string;
    name: string;
  };
  destinationTank: {
    id: string;
    name: string;
  };
  quantity: number;
  description: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export type ApiTransferResponse = ApiResponse<ApiTransferItem>;
export type ApiTransferListResponse = ApiListResponse<ApiTransferItem>;

export interface TransferListResponse {
  transfers: Transfer[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTransferData {
  batchId: string;
  originTankId: string;
  destinationTankId: string;
  quantity: number;
  description: string;
}

export interface UpdateTransferData extends CreateTransferData {
  id: string;
}
