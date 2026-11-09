'use client';

import { CommercialReportView } from '@/features/commercialReport';
import { DashboardLayout } from '@/shared/components/Layout';

export default function CommercialReportPage() {
  return (
    <DashboardLayout>
      <CommercialReportView />
    </DashboardLayout>
  );
}
