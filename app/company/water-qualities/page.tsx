'use client';

import { WaterQualitiesListView, useWaterQualitiesListPage } from '@/features/waterQuality';
import { DashboardLayout } from '@/shared/components/Layout';

export default function WaterQualitiesPage() {
  const state = useWaterQualitiesListPage();

  return (
    <DashboardLayout>
      <WaterQualitiesListView {...state} />
    </DashboardLayout>
  );
}
