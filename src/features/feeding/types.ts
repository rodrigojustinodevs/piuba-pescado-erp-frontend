/**
 * Tipos relacionados à entidade Feeding (Alimentação)
 */

import type { ApiListResponse } from '@/shared/types/api';

export interface Feeding {
  id: string;
  batch: {
    id: string;
    name: string;
  };
  feedingDate: string;
  quantityProvided: number;
  feedType: string;
  stock: {
    id: string;
    /** Insumo (ração) do estoque debitado */
    supplyId?: string | null;
    name: string;
  };
  stockReductionQuantity: number;
  createdAt: string | null;
  updatedAt: string;
}

/**
 * Formato retornado pela API (backend)
 */
export interface ApiFeeding {
  id: string;
  batch: {
    id: string;
    name: string;
  };
  feedingDate: string;
  quantityProvided: number;
  feedType: string;
  stock: {
    id: string;
    /** Insumo (ração) do estoque debitado */
    supplyId?: string | null;
    name: string;
  };
  stockReductionQuantity: number;
  createdAt: string | null;
  updatedAt: string;
}

export type ApiFeedingListResponse = ApiListResponse<ApiFeeding>;

export interface FeedingListResponse {
  feedings: Feeding[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Dados para criação de alimentação
 */
export interface CreateFeedingData {
  batchId: string;
  feedingDate: string;
  quantityProvided: number;
  feedType: string;
  /** Insumo (ração) consumido; o backend resolve o estoque correspondente */
  supplyId: string;
  stockReductionQuantity: number;
}

/**
 * Dados para atualização de alimentação
 */
export interface UpdateFeedingData extends CreateFeedingData {
  id: string;
}

export type FeedingDialogMode = 'create' | 'edit' | 'view';
