// Client Side Logic
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { extractHttpStatus } from '@/shared/lib/http/httpError';
import { parseGateError } from '@/features/billing/utils/gating';
import { gateStore } from '@/features/billing/gate/gateStore';

/** Dados que mudam a cada minuto (sensores, qualidade da água): cache curto. */
export const REALTIME_STALE_TIME = 1000 * 30;

function isBillingKey(key: readonly unknown[] | undefined): boolean {
  return key?.[0] === 'billing';
}

/**
 * Interceptor global do 403 de feature gating: qualquer query/mutation bloqueada por
 * plano abre o diálogo de upgrade/regularização. As rotas de billing nunca são
 * bloqueadas, então ficam de fora.
 */
function handleGateError(error: unknown, key: readonly unknown[] | undefined) {
  if (isBillingKey(key)) return;
  const gate = parseGateError(error);
  if (gate) gateStore.show(gate);
}

// Cria um cliente de cache do React Query que será usado globalmente
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => handleGateError(error, query.queryKey),
  }),
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => handleGateError(error, mutation.options.mutationKey),
  }),
  defaultOptions: {
    queries: {
      // Exemplo: Define um tempo de cache de 5 minutos para otimizar performance do ERP
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false, // Desativa refetch desnecessário em ERPs
      // Token expirado (401) não se resolve tentando de novo — falha rápido para
      // useAuthRedirect redirecionar ao login sem esperar os retries.
      // 403 de gating também não muda tentando de novo.
      retry: (failureCount, error) =>
        extractHttpStatus(error) !== 401 && parseGateError(error) === null && failureCount < 3,
    },
  },
});
