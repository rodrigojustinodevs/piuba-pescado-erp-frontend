'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { transferService } from '../services/transferService';
import type { CreateTransferData } from '../types';

export function useCreateTransfer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateTransferData) => transferService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers', 'list'] });
      showSuccess('Transferência criada com sucesso!');
      router.push('/company/transfers');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao criar transferência. Tente novamente.');
    },
  });
}
