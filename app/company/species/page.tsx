'use client';

import { SpeciesListView, useSpeciesListPage } from '@/features/species';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SpeciesPage() {
  const state = useSpeciesListPage();

  return (
    <DashboardLayout>
      <SpeciesListView {...state} />
    </DashboardLayout>
  );
}
