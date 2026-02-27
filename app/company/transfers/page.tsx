'use client';

import { TransfersListView, useTransfersListPage } from '@/features/transfer';
import { DashboardLayout } from '@/shared/components/Layout';

export default function TransfersPage() {
  const state = useTransfersListPage();

  return (
    <DashboardLayout>
      <TransfersListView {...state} />
    </DashboardLayout>
  );
}
