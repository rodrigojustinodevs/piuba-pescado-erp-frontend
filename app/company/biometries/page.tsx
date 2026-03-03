'use client';

import { BiometriesListView, useBiometriesListPage } from '@/features/biometry';
import { DashboardLayout } from '@/shared/components/Layout';

export default function BiometriesPage() {
  const state = useBiometriesListPage();

  return (
    <DashboardLayout>
      <BiometriesListView {...state} />
    </DashboardLayout>
  );
}
