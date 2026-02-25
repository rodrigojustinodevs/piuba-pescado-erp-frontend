'use client';

import { CompaniesListView } from '@/features/company/components/CompaniesListView';
import { useCompaniesListPage } from '@/features/company/hooks/useCompaniesListPage';
import { DashboardLayout } from '@/shared/components/Layout';
import { demoUser } from '@/shared/constants/demoUser';

export default function CompaniesPage() {
  const state = useCompaniesListPage();

  return (
    <DashboardLayout user={demoUser}>
      <CompaniesListView {...state} />
    </DashboardLayout>
  );
}
