'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateClientData } from '../types';
import { clientService } from '../services/clientService';
import { translateClientApiErrorMessagePtBR } from '../utils/errorMessagePtBR';

export function useCreateClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateClientData) => clientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', 'list'] });
      showSuccess('Cliente cadastrado com sucesso!');
      router.push('/company/clients');
    },
    onError: (error: Error) => {
      const message = error.message ? translateClientApiErrorMessagePtBR(error.message) : '';
      showError(message || 'Erro ao cadastrar cliente. Tente novamente.');
    },
  });
}

