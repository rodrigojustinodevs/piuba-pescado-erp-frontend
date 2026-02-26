'use client';

import { BatchesListView, useBatchesListPage } from '@/features/batch';
import { DashboardLayout } from '@/shared/components/Layout';

export default function BatchListPage() {
  const state = useBatchesListPage();

  return (
    <DashboardLayout>
      <BatchesListView {...state} />
    </DashboardLayout>
  );
}
