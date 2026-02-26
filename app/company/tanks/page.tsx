'use client';

import { TanksListView, useTanksListPage } from '@/features/tank';
import { DashboardLayout } from '@/shared/components/Layout';

export default function TanksPage() {
  const state = useTanksListPage();

  return (
    <DashboardLayout>
      <TanksListView {...state} />
    </DashboardLayout>
  );
}
