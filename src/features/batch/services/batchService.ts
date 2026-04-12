import axios from 'axios';
import type {
  Batch,
  BatchDistributionPayload,
  BatchListResponse,
  CreateBatchData,
  UpdateBatchData,
} from '../types';

type ApiEnvelope<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

function unwrapEnvelope<T>(payload: ApiEnvelope<T> | T): T {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'success' in payload &&
    payload.success === true
  ) {
    return payload.data;
  }

  return payload as T;
}

/**
 * Cliente axios para listagem (plural: batches)
 */
const batchesApi = axios.create({
  baseURL: '/api/company/batches',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Serviço de API para lotes (batches)
 */
export const batchService = {
  /**
   * Lista todos os lotes da empresa.
   * Usa /api/company/batches (plural) apenas para listagem.
   */
  async getBatches(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<BatchListResponse> {
    const response = await batchesApi.get<ApiEnvelope<BatchListResponse> | BatchListResponse>('/', {
      params,
    });
    return unwrapEnvelope(response.data);
  },

  /**
   * Busca um lote por ID.
   * Padronizado para /api/company/batches/[id].
   */
  async getById(id: string): Promise<Batch> {
    const response = await batchesApi.get<ApiEnvelope<Batch> | Batch>(`/${id}`);
    return unwrapEnvelope(response.data);
  },

  /**
   * Cria um novo lote.
   * Padronizado para /api/company/batches.
   */
  async create(data: CreateBatchData): Promise<Batch> {
    const response = await batchesApi.post<ApiEnvelope<Batch> | Batch>('/', data);
    return unwrapEnvelope(response.data);
  },

  /**
   * Atualiza um lote existente.
   * Padronizado para /api/company/batches/[id].
   */
  async update(data: UpdateBatchData): Promise<Batch> {
    const { id, ...updateData } = data;
    const response = await batchesApi.put<ApiEnvelope<Batch> | Batch>(`/${id}`, updateData);
    return unwrapEnvelope(response.data);
  },

  /**
   * Remove um lote.
   * Padronizado para /api/company/batches/[id].
   */
  async delete(id: string): Promise<void> {
    await batchesApi.delete(`/${id}`);
  },

  /**
   * Entrada de lote com distribuição entre tanques.
   * POST /api/company/batches/distribution → backend company/batches/distribution
   */
  async distribute(data: BatchDistributionPayload): Promise<unknown> {
    const response = await batchesApi.post<ApiEnvelope<unknown> | unknown>('/distribution', data);
    return unwrapEnvelope(response.data);
  },
};
