'use client';

import { Suspense } from 'react';
import { BillingPage } from '@/features/billing/components/BillingPage';
import { PlansView } from '@/features/billing/components/PlansView';
import { BillingLoading } from '@/features/billing/components/states';
import { DashboardLayout } from '@/shared/components/Layout';

export default function PlansPage() {
  return (
    <DashboardLayout>
      <BillingPage
        title="Planos"
        subtitle="Compare os planos e escolha o ideal para a sua operação"
      >
        <Suspense fallback={<BillingLoading />}>
          <PlansView />
        </Suspense>
      </BillingPage>
    </DashboardLayout>
  );
}
