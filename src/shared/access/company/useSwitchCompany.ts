'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { accessEvents } from '../accessEvents';

/**
 * Troca a empresa ativa (`POST /auth/switch-company`). Depois da troca nada do cache
 * da empresa anterior pode sobreviver: limpa o React Query inteiro e recarrega a rota.
 */
export function useSwitchCompany() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ['auth', 'switch-company'],
    mutationFn: (companyId: string) =>
      browserHttpClient.post<{ companyId: string; role: string | null }>(
        '/api/auth/switch-company',
        { companyId },
      ),
    onSuccess: () => {
      queryClient.clear();
      accessEvents.reset();
      router.replace('/dashboard');
      router.refresh();
    },
  });
}
