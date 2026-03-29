'use client';

import { MortalitiesListView, useMortalitiesListPage } from '@/features/mortality';
import { DashboardLayout } from '@/shared/components/Layout';

export default function MortalitiesPage() {
  const state = useMortalitiesListPage();

  return (
    <DashboardLayout>
      <MortalitiesListView {...state} />
    </DashboardLayout>
  );
}
