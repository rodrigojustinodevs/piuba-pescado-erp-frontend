'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { settlementService } from '../services/settlementService';
import type { UpdateSettlementData } from '../types';

export function useUpdateSettlement() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateSettlementData) => settlementService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['settlements', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['settlements', 'detail', data.id] });
      showSuccess('Povoamento atualizado com sucesso!');
      router.push('/company/settlements');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar povoamento. Tente novamente.');
    },
  });
}
