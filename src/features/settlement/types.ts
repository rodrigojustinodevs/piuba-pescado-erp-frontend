import type { ApiListResponse, ApiResponse } from '@/shared/types/api';

export interface Settlement {
  id: string;
  batcheId: string;
  settlementDate: string;
  quantity: number;
  averageWeight: number;
  createdAt: string;
  updatedAt: string;
}

export type ApiSettlementResponse = ApiResponse<Settlement>;
export type ApiSettlementListResponse = ApiListResponse<Settlement>;

export interface SettlementListResponse {
  settlements: Settlement[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSettlementData {
  batcheId: string;
  settlementDate: string;
  quantity: number;
  averageWeight: number;
}

export interface UpdateSettlementData extends CreateSettlementData {
  id: string;
}
