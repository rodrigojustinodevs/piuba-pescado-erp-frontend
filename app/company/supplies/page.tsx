'use client';

import { SuppliesListView, useSuppliesListPage } from '@/features/supply';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SuppliesPage() {
  const state = useSuppliesListPage();

  return (
    <DashboardLayout>
      <SuppliesListView {...state} />
    </DashboardLayout>
  );
}

