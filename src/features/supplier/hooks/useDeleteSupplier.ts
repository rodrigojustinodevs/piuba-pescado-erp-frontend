'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { supplierService } from '../services/supplierService';

export function useDeleteSupplier() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => supplierService.delete(id),
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers', 'list'] });
      queryClient.removeQueries({ queryKey: ['suppliers', 'detail', deletedId] });
      showSuccess('Fornecedor excluído com sucesso!');
      router.push('/company/suppliers');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir fornecedor. Tente novamente.');
    },
  });
}
