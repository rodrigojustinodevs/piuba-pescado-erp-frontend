'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateSaleData } from '../types';
import { saleService } from '../services/saleService';
import { translateSaleApiErrorMessagePtBR } from '../utils/errorMessagePtBR';

export function useCreateSale({ skipNavigateToList }: { skipNavigateToList?: boolean } = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateSaleData) => saleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales', 'list'] });
      showSuccess('Venda cadastrada com sucesso!');
      if (!skipNavigateToList) router.push('/company/sales');
    },
    onError: (error: Error) => {
      const message = error.message ? translateSaleApiErrorMessagePtBR(error.message) : '';
      showError(message || 'Erro ao cadastrar venda. Tente novamente.');
    },
  });
}

