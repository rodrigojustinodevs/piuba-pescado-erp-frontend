'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TanksListView, useTanksListPage } from '@/features/tank';
import { DashboardLayout } from '@/shared/components/Layout';

function TanksPageContent() {
  const state = useTanksListPage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [autoOpenCreate] = useState(() => searchParams.get('new') === 'true');

  useEffect(() => {
    if (autoOpenCreate) {
      router.replace('/company/tanks');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenCreate]);

  return (
    <DashboardLayout>
      <TanksListView {...state} autoOpenCreate={autoOpenCreate} />
    </DashboardLayout>
  );
}

export default function TanksPage() {
  return (
    <Suspense fallback={null}>
      <TanksPageContent />
    </Suspense>
  );
}
