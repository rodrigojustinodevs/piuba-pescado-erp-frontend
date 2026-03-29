'use client';

import { SensorReadingsListView, useSensorReadingsListPage } from '@/features/sensorReading';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SensorReadingsPage() {
  const state = useSensorReadingsListPage();

  return (
    <DashboardLayout>
      <SensorReadingsListView {...state} />
    </DashboardLayout>
  );
}
