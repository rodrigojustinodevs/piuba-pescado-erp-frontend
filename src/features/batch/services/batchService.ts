import axios from "axios";
import type {
  BatchListResponse,
  CreateBatchData,
  UpdateBatchData,
  Batch,
} from "../types";

/**
 * Cliente axios para listagem (plural: batches)
 */
const batchesApi = axios.create({
  baseURL: "/api/company/batches",
  headers: {
    "Content-Type": "application/json",
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
    const response = await batchesApi.get<BatchListResponse>("/", { params });
    return response.data;
  },

  /**
   * Busca um lote por ID.
   * Padronizado para /api/company/batches/[id].
   */
  async getById(id: string): Promise<Batch> {
    const response = await batchesApi.get<Batch>(`/${id}`);
    return response.data;
  },

  /**
   * Cria um novo lote.
   * Padronizado para /api/company/batches.
   */
  async create(data: CreateBatchData): Promise<Batch> {
    const response = await batchesApi.post<Batch>("/", data);
    return response.data;
  },

  /**
   * Atualiza um lote existente.
   * Padronizado para /api/company/batches/[id].
   */
  async update(data: UpdateBatchData): Promise<Batch> {
    const { id, ...updateData } = data;
    const response = await batchesApi.put<Batch>(`/${id}`, updateData);
    return response.data;
  },

  /**
   * Remove um lote.
   * Padronizado para /api/company/batches/[id].
   */
  async delete(id: string): Promise<void> {
    await batchesApi.delete(`/${id}`);
  },
};
