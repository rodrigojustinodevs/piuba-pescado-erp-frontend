'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { purchaseService } from '../services/purchaseService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

interface ReceiveItemPayload {
  purchase_item_id: string;
  received_quantity: number;
}

export function useReceivePurchaseItems() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ id, items }: { id: string; items: ReceiveItemPayload[] }) =>
      purchaseService.receiveItems(id, items),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchases', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', 'detail', data.id] });
      showSuccess('Recebimento registrado com sucesso!');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao registrar recebimento. Tente novamente.');
    },
  });
}
