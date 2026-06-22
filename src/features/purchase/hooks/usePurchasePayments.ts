'use client';

import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '../services/purchaseService';

export function usePurchasePayments(purchaseId: string | null | undefined) {
  return useQuery({
    queryKey: ['purchases', 'payments', purchaseId],
    queryFn: () => purchaseService.getPayments(purchaseId!),
    enabled: !!purchaseId,
    staleTime: 1000 * 60,
  });
}
