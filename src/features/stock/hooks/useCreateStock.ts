'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateStockData } from '../types';
import { stockService } from '../services/stockService';

export function useCreateStock() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateStockData) => stockService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', 'list'] });
      showSuccess('Estoque cadastrado com sucesso!');
      router.push('/company/stocks');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao cadastrar estoque. Tente novamente.');
    },
  });
}
