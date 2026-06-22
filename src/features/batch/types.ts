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
  name?: string;
  description?: string | null;
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
  name: string;
  description: string;
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

export type BatchDialogMode = 'create' | 'edit' | 'view';

export type BatchStatusFilter = 'all' | BatchStatus;

export type BatchesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  filter: BatchStatusFilter;
  setFilter: (next: BatchStatusFilter) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: BatchListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  filteredBatches: Batch[];
  stats: {
    total: number;
    finishedCount: number;
  };
  handleDelete: (id: string, species: string) => void;
  isDeleting: boolean;
};

/** Item de distribuição do lote entre tanques (POST batches/distribution) */
export interface BatchDistributionItem {
  tankId: string;
  quantity: number;
  averageWeight: number;
}

/** Corpo da entrada de lote com distribuição */
export interface BatchDistributionPayload {
  supplierId: string;
  totalCost: number;
  entryDate: string;
  species: string;
  cultivation: string;
  notes?: string;
  distribution: BatchDistributionItem[];
}
