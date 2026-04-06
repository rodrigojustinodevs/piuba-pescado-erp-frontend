'use client';

import { SalesListView, useSalesListPage } from '@/features/sale';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SalesPage() {
  const state = useSalesListPage();

  return (
    <DashboardLayout>
      <SalesListView {...state} />
    </DashboardLayout>
  );
}

