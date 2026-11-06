'use client';

import { ProductionReportView } from '@/features/productionReport';
import { DashboardLayout } from '@/shared/components/Layout';

export default function ProductionReportPage() {
  return (
    <DashboardLayout>
      <ProductionReportView />
    </DashboardLayout>
  );
}
