'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateSupplyData } from '../types';
import { supplyService } from '../services/supplyService';

export function useCreateSupply() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateSupplyData) => supplyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['purchaseLookups', 'supplies'] });
      showSuccess('Produto cadastrado com sucesso!');
      router.push('/company/supplies');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao cadastrar produto. Tente novamente.');
    },
  });
}

