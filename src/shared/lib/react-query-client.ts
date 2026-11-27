// Client Side Logic
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { handleApiError } from '@/shared/access/handleApiError';
import { isRetryable } from '@/shared/lib/http/apiError';

/** Dados que mudam a cada minuto (sensores, qualidade da água): cache curto. */
export const REALTIME_STALE_TIME = 1000 * 30;

/**
 * Tratamento central de erros da API (401/402/403/409) para toda query e mutation.
 * Ver `src/shared/access/handleApiError.ts`. 422 continua com a tela.
 */
export const queryClient: QueryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) =>
      handleApiError(queryClient, error, { queryKey: query.queryKey, isMutation: false }),
  }),
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) =>
      handleApiError(queryClient, error, {
        queryKey: mutation.options.mutationKey,
        isMutation: true,
      }),
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      // 4xx (sessão, plano, permissão, validação) não muda tentando de novo.
      retry: (failureCount, error) => isRetryable(error) && failureCount < 3,
    },
  },
});
