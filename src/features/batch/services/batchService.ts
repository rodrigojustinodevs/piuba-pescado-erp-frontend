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
 * Cliente axios para operações individuais (singular: batche)
 */
const batcheApi = axios.create({
  baseURL: "/api/company/batche",
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
  }): Promise<BatchListResponse> {
    const response = await batchesApi.get<BatchListResponse>("/", { params });
    return response.data;
  },

  /**
   * Busca um lote por ID.
   * Usa /api/company/batche (singular).
   */
  async getById(id: string): Promise<Batch> {
    const response = await batcheApi.get<Batch>(`/${id}`);
    return response.data;
  },

  /**
   * Cria um novo lote.
   * Usa /api/company/batche (singular).
   */
  async create(data: CreateBatchData): Promise<Batch> {
    const response = await batcheApi.post<Batch>("/", data);
    return response.data;
  },

  /**
   * Atualiza um lote existente.
   * Usa /api/company/batche (singular).
   */
  async update(data: UpdateBatchData): Promise<Batch> {
    const { id, ...updateData } = data;
    const response = await batcheApi.put<Batch>(`/${id}`, updateData);
    return response.data;
  },

  /**
   * Remove um lote.
   * Usa /api/company/batche (singular).
   */
  async delete(id: string): Promise<void> {
    await batcheApi.delete(`/${id}`);
  },
};
