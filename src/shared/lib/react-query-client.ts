// Client Side Logic
import { QueryClient } from "@tanstack/react-query";

// Cria um cliente de cache do React Query que será usado globalmente
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Exemplo: Define um tempo de cache de 5 minutos para otimizar performance do ERP
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false, // Desativa refetch desnecessário em ERPs
    },
  },
});
