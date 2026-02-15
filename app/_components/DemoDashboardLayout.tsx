'use client';

import type { ReactNode } from 'react';
import { DashboardLayout } from '@/shared/components/Layout';

const demoUser = {
  name: 'Usuário Demo',
  email: 'demo@dev.com',
} as const;

export function DemoDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout user={demoUser}>{children}</DashboardLayout>;
}
