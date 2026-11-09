'use client';

import { FinancialReportView } from '@/features/financialReport';
import { DashboardLayout } from '@/shared/components/Layout';

export default function FinancialReportPage() {
  return (
    <DashboardLayout>
      <FinancialReportView />
    </DashboardLayout>
  );
}
