'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateFinancialCategoryData } from '../types';
import { financialCategoryService } from '../services/financialCategoryService';

type Options = {
  skipNavigateToList?: boolean;
};

export function useCreateFinancialCategory({ skipNavigateToList = false }: Options = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateFinancialCategoryData) => financialCategoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories', 'list'] });
      showSuccess('Categoria financeira cadastrada com sucesso!');
      if (!skipNavigateToList) router.push('/company/financial-categories');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao cadastrar categoria financeira. Tente novamente.');
    },
  });
}
