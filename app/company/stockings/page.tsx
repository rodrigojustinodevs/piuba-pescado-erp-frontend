'use client';

import { StockingsListView, useStockingsListPage } from '@/features/stocking';
import { DashboardLayout } from '@/shared/components/Layout';

export default function StockingsPage() {
  const state = useStockingsListPage();

  return (
    <DashboardLayout>
      <StockingsListView {...state} />
    </DashboardLayout>
  );
}
