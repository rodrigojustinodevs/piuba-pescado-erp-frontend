'use client';

import { useParams } from 'next/navigation';
import { useSupply } from '@/features/supply';
import { SupplyDetailView } from '@/features/supply/components';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function SupplyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: supply, isLoading, error } = useSupply(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !supply) {
    return (
      <DashboardLayout>
        <NotFoundState message="Produto não encontrado." backHref="/company/supplies" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SupplyDetailView supply={supply} />
    </DashboardLayout>
  );
}

