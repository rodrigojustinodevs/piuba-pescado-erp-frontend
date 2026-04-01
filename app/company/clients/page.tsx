'use client';

import { ClientsListView, useClientsListPage } from '@/features/client';
import { DashboardLayout } from '@/shared/components/Layout';

export default function ClientsPage() {
  const state = useClientsListPage();

  return (
    <DashboardLayout>
      <ClientsListView {...state} />
    </DashboardLayout>
  );
}

