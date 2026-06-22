'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { supplierService } from '../services/supplierService';
import type { UpdateSupplierData } from '../types';

type UseUpdateSupplierOptions = {
  skipNavigateToList?: boolean;
};

export function useUpdateSupplier({ skipNavigateToList }: UseUpdateSupplierOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateSupplierData) => supplierService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers', 'detail', data.id] });
      showSuccess('Fornecedor atualizado com sucesso!');
      if (!skipNavigateToList) {
        router.push('/company/suppliers');
      }
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar fornecedor. Tente novamente.');
    },
  });
}
