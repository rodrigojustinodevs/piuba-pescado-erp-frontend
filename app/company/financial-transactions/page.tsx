'use client';

import { FinancialTransactionsListView, useFinancialTransactionsListPage } from '@/features/financialTransaction';
import { DashboardLayout } from '@/shared/components/Layout';

export default function FinancialTransactionsPage() {
  const state = useFinancialTransactionsListPage();

  return (
    <DashboardLayout>
      <FinancialTransactionsListView {...state} />
    </DashboardLayout>
  );
}

