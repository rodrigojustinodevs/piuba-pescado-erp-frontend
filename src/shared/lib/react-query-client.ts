// Client Side Logic
import { QueryClient } from '@tanstack/react-query';
import { extractHttpStatus } from '@/shared/lib/http/httpError';

// Cria um cliente de cache do React Query que será usado globalmente
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Exemplo: Define um tempo de cache de 5 minutos para otimizar performance do ERP
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false, // Desativa refetch desnecessário em ERPs
      // Token expirado (401) não se resolve tentando de novo — falha rápido para
      // useAuthRedirect redirecionar ao login sem esperar os retries.
      retry: (failureCount, error) => extractHttpStatus(error) !== 401 && failureCount < 3,
    },
  },
});
