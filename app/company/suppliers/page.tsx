'use client';

import { SuppliersListView, useSuppliersListPage } from '@/features/supplier';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SuppliersPage() {
  const state = useSuppliersListPage();

  return (
    <DashboardLayout>
      <SuppliersListView {...state} />
    </DashboardLayout>
  );
}
