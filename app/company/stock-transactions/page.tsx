'use client';

import { StockTransactionsListView, useStockTransactionsListPage } from '@/features/stockTransaction';
import { DashboardLayout } from '@/shared/components/Layout';

export default function StockTransactionsPage() {
  const state = useStockTransactionsListPage();

  return (
    <DashboardLayout>
      <StockTransactionsListView {...state} />
    </DashboardLayout>
  );
}

