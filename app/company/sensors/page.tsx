'use client';

import { SensorsListView, useSensorsListPage } from '@/features/sensor';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SensorsPage() {
  const state = useSensorsListPage();

  return (
    <DashboardLayout>
      <SensorsListView {...state} />
    </DashboardLayout>
  );
}
