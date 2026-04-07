'use client';

import { FinancialCategoriesListView, useFinancialCategoriesListPage } from '@/features/financialCategory';
import { DashboardLayout } from '@/shared/components/Layout';

export default function FinancialCategoriesPage() {
  const state = useFinancialCategoriesListPage();

  return (
    <DashboardLayout>
      <FinancialCategoriesListView {...state} />
    </DashboardLayout>
  );
}
