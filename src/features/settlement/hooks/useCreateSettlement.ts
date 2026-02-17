'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { settlementService } from '../services/settlementService';
import type { CreateSettlementData } from '../types';

export function useCreateSettlement() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateSettlementData) => settlementService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements', 'list'] });
      showSuccess('Povoamento criado com sucesso!');
      router.push('/company/settlements');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao criar povoamento. Tente novamente.');
    },
  });
}
