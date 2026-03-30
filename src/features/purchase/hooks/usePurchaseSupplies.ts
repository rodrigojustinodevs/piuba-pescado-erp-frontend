'use client';

import { useQuery } from '@tanstack/react-query';
import { purchaseLookupService } from '../services/purchaseLookupService';

export function usePurchaseSupplies(enabled = true, companyId?: string | null) {
  const cid = companyId?.trim() || null;
  return useQuery({
    queryKey: ['purchaseLookups', 'supplies', cid],
    queryFn: () => purchaseLookupService.listSupplies(cid),
    enabled: enabled && !!cid,
    staleTime: 1000 * 60 * 10,
  });
}
