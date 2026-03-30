'use client';

import { PurchasesListView, usePurchasesListPage } from '@/features/purchase';
import { DashboardLayout } from '@/shared/components/Layout';

export default function PurchasesPage() {
  const state = usePurchasesListPage();

  return (
    <DashboardLayout>
      <PurchasesListView {...state} />
    </DashboardLayout>
  );
}
