'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { UpdateFinancialCategoryData } from '../types';
import { financialCategoryService } from '../services/financialCategoryService';

export function useUpdateFinancialCategory() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateFinancialCategoryData) => financialCategoryService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['financial-categories', 'detail', data.id] });
      showSuccess('Categoria financeira atualizada com sucesso!');
      router.push('/company/financial-categories');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar categoria financeira. Tente novamente.');
    },
  });
}
