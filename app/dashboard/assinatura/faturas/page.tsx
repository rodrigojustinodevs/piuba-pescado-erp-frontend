'use client';

import { Suspense } from 'react';
import { BillingPage } from '@/features/billing/components/BillingPage';
import { InvoicesView } from '@/features/billing/components/InvoicesView';
import { BillingLoading } from '@/features/billing/components/states';
import { DashboardLayout } from '@/shared/components/Layout';

export default function InvoicesPage() {
  return (
    <DashboardLayout>
      <BillingPage title="Faturas" subtitle="Histórico de cobranças da assinatura">
        <Suspense fallback={<BillingLoading />}>
          <InvoicesView />
        </Suspense>
      </BillingPage>
    </DashboardLayout>
  );
}
