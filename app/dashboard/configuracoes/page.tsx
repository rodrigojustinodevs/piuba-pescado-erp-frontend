'use client';

import { Suspense } from 'react';
import { SettingsView } from '@/features/companySettings';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={null}>
        <SettingsView />
      </Suspense>
    </DashboardLayout>
  );
}
