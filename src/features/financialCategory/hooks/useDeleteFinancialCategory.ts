'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { financialCategoryService } from '../services/financialCategoryService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

export function useDeleteFinancialCategory() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => financialCategoryService.delete(id),
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories', 'list'] });
      queryClient.removeQueries({ queryKey: ['financial-categories', 'detail', deletedId] });
      showSuccess('Categoria financeira excluída com sucesso!');
      router.push('/company/financial-categories');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao excluir categoria financeira. Tente novamente.');
    },
  });
}
