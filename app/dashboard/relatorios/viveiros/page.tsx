'use client';

import { TankReportView } from '@/features/tankReport';
import { DashboardLayout } from '@/shared/components/Layout';

export default function TankReportPage() {
  return (
    <DashboardLayout>
      <TankReportView />
    </DashboardLayout>
  );
}
