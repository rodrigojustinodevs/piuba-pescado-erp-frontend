import type {
  ApiBatchListResponse,
  ApiBatchResponse,
  BatchListResponse,
  Batch,
} from "../types";

/**
 * Mapeia a resposta da API para o formato padronizado usado no frontend
 * Retorna: { batches: Batch[], total: number, page: number, limit: number }
 */
export function mapApiBatchList(apiData: ApiBatchListResponse): BatchListResponse {
  const batches: Batch[] = apiData.response || [];

  return {
    batches,
    total: apiData.pagination?.total ?? 0,
    page: apiData.pagination?.current_page ?? 1,
    limit: apiData.pagination?.per_page ?? 25,
  };
}

/**
 * Mapeia a resposta da API individual para o formato Batch
 */
export function mapApiBatch(apiData: ApiBatchResponse): Batch {
  return apiData.response;
}
