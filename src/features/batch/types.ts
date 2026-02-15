/**
 * Tipos relacionados à entidade Batch (Lote)
 */

import type { ApiListResponse, ApiResponse } from '@/shared/types/api';

export type BatchStatus = 'active' | 'finished';

export type BatchCultivation = 'daycare' | string;

export interface BatchTank {
  id: string;
  name: string;
}

export interface Batch {
  id: string;
  entryDate: string | null;
  initialQuantity: number;
  species: string;
  status: BatchStatus;
  cultivation: BatchCultivation;
  tank: BatchTank;
  createdAt: string;
  updatedAt: string;
}

/**
 * Formato de resposta da API para operações individuais (formato bruto da API)
 */
export type ApiBatchResponse = ApiResponse<Batch>;

/**
 * Dados para criação de um novo lote
 */
export interface CreateBatchData {
  tankId: string;
  entryDate: string;
  initialQuantity: number;
  species: string;
  cultivation: string;
}

/**
 * Dados para atualização de um lote existente
 */
export interface UpdateBatchData extends Partial<CreateBatchData> {
  id: string;
}

/**
 * Formato de resposta da API para listagem de lotes (formato bruto da API)
 */
export type ApiBatchListResponse = ApiListResponse<Batch>;

/**
 * Formato padronizado para uso no frontend
 */
export interface BatchListResponse {
  batches: Batch[];
  total: number;
  page: number;
  limit: number;
}
