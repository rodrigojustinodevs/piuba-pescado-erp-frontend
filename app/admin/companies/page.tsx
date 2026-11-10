'use client';

import { CompaniesListView } from '@/features/company/components/CompaniesListView';
import { useCompaniesListPage } from '@/features/company/hooks/useCompaniesListPage';
import { DashboardLayout } from '@/shared/components/Layout';

export default function CompaniesPage() {
  const state = useCompaniesListPage();

  return (
    <DashboardLayout>
      <CompaniesListView {...state} />
    </DashboardLayout>
  );
}
