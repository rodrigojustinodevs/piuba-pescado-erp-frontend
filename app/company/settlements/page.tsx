'use client';

import { SettlementsListView, useSettlementsListPage } from '@/features/settlement';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SettlementsPage() {
  const state = useSettlementsListPage();

  return (
    <DashboardLayout>
      <SettlementsListView {...state} />
    </DashboardLayout>
  );
}
