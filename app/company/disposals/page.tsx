'use client';

import { HarvestsListView, useHarvestsListPage } from '@/features/harvest';
import { DashboardLayout } from '@/shared/components/Layout';

export default function DisposalsPage() {
  const state = useHarvestsListPage();

  return (
    <DashboardLayout>
      <HarvestsListView {...state} />
    </DashboardLayout>
  );
}
