/**
 * Tipos relacionados à entidade Batch (Lote)
 */

export type BatchStatus = "active" | "finished" | "canceled";

export type BatchCultivation = "daycare" | string;

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
export interface ApiBatchResponse {
  status: boolean;
  response: Batch;
  message: string;
}

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
export interface ApiBatchListResponse {
  status: boolean;
  response: Batch[];
  message: string;
  pagination: {
    total: number;
    current_page: number;
    last_page: number;
    first_page: number;
    per_page: number;
  };
}

/**
 * Formato padronizado para uso no frontend
 */
export interface BatchListResponse {
  batches: Batch[];
  total: number;
  page: number;
  limit: number;
}
