'use client';

import { useQuery } from '@tanstack/react-query';
import { stockingService } from '../services/stockingService';

export interface UseStockingsParams {
  page?: number;
  perPage?: number;
  /** Só envia na query quando definido e não vazio (`batchId=…`). Omitir = lista geral. */
  batchId?: string;
  /** Termo repassado ao backend como `search` (lista paginada). */
  search?: string;
  enabled?: boolean;
}

export function useStockings({
  page = 1,
  perPage = 25,
  batchId,
  search,
  enabled = true,
}: UseStockingsParams = {}) {
  const filterByBatch = batchId !== undefined;
  const batchKey =
    batchId !== undefined && String(batchId).trim() !== '' ? String(batchId).trim() : null;
  const searchKey = search?.trim() ?? '';

  const queryEnabled = enabled && (!filterByBatch || batchKey !== null);

  return useQuery({
    queryKey: ['stockings', 'list', page, perPage, filterByBatch ? batchKey : 'all', searchKey],
    queryFn: () =>
      stockingService.list({
        page,
        perPage,
        ...(batchKey ? { batchId: batchKey } : {}),
        ...(searchKey ? { search: searchKey } : {}),
      }),
    enabled: queryEnabled,
    /** Lista por lote: sempre refetch ao mudar lote (evita cache “velho” no formulário de venda). */
    staleTime: filterByBatch && batchKey ? 0 : 1000 * 60 * 5,
  });
}
