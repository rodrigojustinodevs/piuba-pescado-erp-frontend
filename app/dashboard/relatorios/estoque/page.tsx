'use client';

import { InventoryReportView } from '@/features/inventoryReport';
import { DashboardLayout } from '@/shared/components/Layout';

export default function InventoryReportPage() {
  return (
    <DashboardLayout>
      <InventoryReportView />
    </DashboardLayout>
  );
}
