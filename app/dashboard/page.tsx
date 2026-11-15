'use client';

import { DashboardView } from '@/features/dashboard';
import { DashboardLayout } from '@/shared/components/Layout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardView />
    </DashboardLayout>
  );
}
