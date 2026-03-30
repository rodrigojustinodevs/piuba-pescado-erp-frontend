'use client';

import { useQuery } from '@tanstack/react-query';
import { purchaseLookupService } from '../services/purchaseLookupService';

export function usePurchaseSuppliers(enabled = true, companyId?: string | null) {
  const cid = companyId?.trim() || null;
  return useQuery({
    queryKey: ['purchaseLookups', 'suppliers', cid],
    queryFn: () => purchaseLookupService.listSuppliers(cid),
    enabled: enabled && !!cid,
    staleTime: 1000 * 60 * 10,
  });
}
