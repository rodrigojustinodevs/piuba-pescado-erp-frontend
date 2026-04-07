'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateFinancialCategoryData } from '../types';
import { financialCategoryService } from '../services/financialCategoryService';

export function useCreateFinancialCategory() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateFinancialCategoryData) => financialCategoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories', 'list'] });
      showSuccess('Categoria financeira cadastrada com sucesso!');
      router.push('/company/financial-categories');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao cadastrar categoria financeira. Tente novamente.');
    },
  });
}
