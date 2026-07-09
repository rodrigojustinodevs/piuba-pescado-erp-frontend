'use client';

import { IntegrationsListView } from '@/features/integration/components/IntegrationsListView';
import { useIntegrationsListPage } from '@/features/integration/hooks/useIntegrationsListPage';
import { DashboardLayout } from '@/shared/components/Layout';
import { demoUser } from '@/shared/constants/demoUser';

export default function IotIntegrationsPage() {
  const state = useIntegrationsListPage();

  return (
    <DashboardLayout user={demoUser}>
      <IntegrationsListView {...state} />
    </DashboardLayout>
  );
}
