'use client';

import { useParams } from 'next/navigation';
import { useBatch } from '@/features/batch';
import { BatchDetailView } from '@/features/batch/components';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function BatchDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: batch, isLoading, error } = useBatch(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !batch) {
    return (
      <DashboardLayout>
        <NotFoundState message="Lote não encontrado." backHref="/company/batches" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <BatchDetailView batch={batch} />
    </DashboardLayout>
  );
}
