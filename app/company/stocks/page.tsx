'use client';

import { StocksListView, useStocksListPage } from '@/features/stock';
import { DashboardLayout } from '@/shared/components/Layout';

export default function StocksPage() {
  const state = useStocksListPage();

  return (
    <DashboardLayout>
      <StocksListView {...state} />
    </DashboardLayout>
  );
}
