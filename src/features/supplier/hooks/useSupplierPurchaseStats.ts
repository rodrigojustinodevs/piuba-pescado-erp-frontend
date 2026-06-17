'use client';

import { useMemo } from 'react';
import { usePurchases } from '@/features/purchase/hooks/usePurchases';

export type SupplierPurchaseStats = {
  totalPurchases: number;
  lastPurchaseAt: string | null;
};

export function useSupplierPurchaseStats() {
  const { data, isLoading } = usePurchases({ limit: 500 });

  const statsBySupplierId = useMemo(() => {
    const result: Record<string, SupplierPurchaseStats> = {};
    for (const purchase of data?.purchases ?? []) {
      const current = result[purchase.supplierId] ?? { totalPurchases: 0, lastPurchaseAt: null };
      current.totalPurchases += purchase.totalPrice;
      if (
        !current.lastPurchaseAt ||
        new Date(purchase.orderDate).getTime() > new Date(current.lastPurchaseAt).getTime()
      ) {
        current.lastPurchaseAt = purchase.orderDate;
      }
      result[purchase.supplierId] = current;
    }
    return result;
  }, [data?.purchases]);

  return { statsBySupplierId, isLoading };
}
