import type { ApiListResponse, ApiResponse } from '@/shared/types/api';

/**
 * Modelo interno usado no frontend (flattened).
 */
export interface Transfer {
  id: string;
  batchId: string;
  batchName?: string;
  batch?: { id: string; name: string };
  originTankId: string;
  originTankName?: string;
  destinationTankId: string;
  destinationTankName?: string;
  quantity: number;
  averageWeight?: number;
  description: string;
  reason?: TransferReason;
  status?: TransferStatus;
  transferDate?: string | null;
  responsible?: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export type TransferReason =
  | 'growth'
  | 'density'
  | 'biosecurity'
  | 'maintenance'
  | 'harvest_prep'
  | 'other';

export type TransferStatus = 'completed' | 'scheduled' | 'cancelled';

export const REASON_LABELS: Record<TransferReason, string> = {
  growth: 'Crescimento',
  density: 'Ajuste de densidade',
  biosecurity: 'Biossegurança',
  maintenance: 'Manutenção do tanque',
  harvest_prep: 'Preparação p/ despesca',
  other: 'Outro',
};

export const STATUS_LABELS: Record<TransferStatus, string> = {
  completed: 'Concluída',
  scheduled: 'Agendada',
  cancelled: 'Cancelada',
};

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
  averageWeight?: number;
  description: string;
  reason?: TransferReason;
  status?: TransferStatus;
  transferDate?: string | null;
  responsible?: string;
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

export type TransferDialogMode = 'create' | 'edit' | 'view';

export interface CreateTransferData {
  companyId?: string;
  batchId: string;
  originTankId: string;
  destinationTankId: string;
  quantity: number;
  description: string;
  transferDate?: string;
  averageWeight?: number;
  reason?: TransferReason;
  status?: TransferStatus;
  responsible?: string;
}

export interface UpdateTransferData extends CreateTransferData {
  id: string;
}

export interface PatchTransferPayload {
  id: string;
  batchId?: string;
  originTankId?: string;
  destinationTankId?: string;
  quantity?: number;
  description?: string;
  transferDate?: string;
  averageWeight?: number;
  reason?: TransferReason;
  status?: TransferStatus;
  responsible?: string;
}
