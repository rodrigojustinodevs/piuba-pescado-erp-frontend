import type { ApiListResponse, ApiResponse } from '@/shared/types/api';

export interface Transfer {
  id: string;
  batcheId: string;
  originTankId: string;
  destinationTankId: string;
  quantity: number;
  description: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export type ApiTransferResponse = ApiResponse<Transfer>;
export type ApiTransferListResponse = ApiListResponse<Transfer>;

export interface TransferListResponse {
  transfers: Transfer[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTransferData {
  batcheId: string;
  originTankId: string;
  destinationTankId: string;
  quantity: number;
  description: string;
}

export interface UpdateTransferData extends CreateTransferData {
  id: string;
}
