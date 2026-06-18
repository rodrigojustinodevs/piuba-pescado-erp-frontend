'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { UpdateClientData } from '../types';
import { clientService } from '../services/clientService';
import { translateClientApiErrorMessagePtBR } from '../utils/errorMessagePtBR';

type UseUpdateClientOptions = {
  skipNavigateToList?: boolean;
};

export function useUpdateClient({ skipNavigateToList }: UseUpdateClientOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateClientData) => clientService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['clients', 'detail', data.id] });
      showSuccess('Cliente atualizado com sucesso!');
      if (!skipNavigateToList) {
        router.push('/company/clients');
      }
    },
    onError: (error: Error) => {
      const message = error.message ? translateClientApiErrorMessagePtBR(error.message) : '';
      showError(message || 'Erro ao atualizar cliente. Tente novamente.');
    },
  });
}
