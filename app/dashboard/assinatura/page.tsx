'use client';

import { Suspense } from 'react';
import { BillingPage } from '@/features/billing/components/BillingPage';
import { SubscriptionOverview } from '@/features/billing/components/SubscriptionOverview';
import { BillingLoading } from '@/features/billing/components/states';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SubscriptionPage() {
  return (
    <DashboardLayout>
      <BillingPage
        title="Minha assinatura"
        subtitle="Plano, cobrança e status da assinatura da empresa"
      >
        <Suspense fallback={<BillingLoading />}>
          <SubscriptionOverview />
        </Suspense>
      </BillingPage>
    </DashboardLayout>
  );
}
