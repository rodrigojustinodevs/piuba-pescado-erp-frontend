'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { UpdateSaleData } from '../types';
import { saleService } from '../services/saleService';
import { translateSaleApiErrorMessagePtBR } from '../utils/errorMessagePtBR';

export function useUpdateSale() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateSaleData) => saleService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sales', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['sales', 'detail', data.id] });
      showSuccess('Venda atualizada com sucesso!');
      router.push('/company/sales');
    },
    onError: (error: Error) => {
      const message = error.message ? translateSaleApiErrorMessagePtBR(error.message) : '';
      showError(message || 'Erro ao atualizar venda. Tente novamente.');
    },
  });
}
