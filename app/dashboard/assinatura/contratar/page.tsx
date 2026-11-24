'use client';

import { Suspense } from 'react';
import { BillingPage } from '@/features/billing/components/BillingPage';
import { SubscribeView } from '@/features/billing/components/SubscribeView';
import { BillingLoading } from '@/features/billing/components/states';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SubscribePage() {
  return (
    <DashboardLayout>
      <BillingPage
        title="Contratar plano"
        subtitle="Escolha a forma de pagamento e conclua a contratação"
      >
        <Suspense fallback={<BillingLoading />}>
          <SubscribeView />
        </Suspense>
      </BillingPage>
    </DashboardLayout>
  );
}
