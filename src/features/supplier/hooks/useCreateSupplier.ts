'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateSupplierData } from '../types';
import { supplierService } from '../services/supplierService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

type UseCreateSupplierOptions = {
  skipNavigateToList?: boolean;
};

export function useCreateSupplier({ skipNavigateToList }: UseCreateSupplierOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateSupplierData) => supplierService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers', 'list'] });
      showSuccess('Fornecedor cadastrado com sucesso!');
      if (!skipNavigateToList) {
        router.push('/company/suppliers');
      }
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao cadastrar fornecedor. Tente novamente.');
    },
  });
}
