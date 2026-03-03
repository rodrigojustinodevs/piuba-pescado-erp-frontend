'use client';

import { useParams } from 'next/navigation';
import { useBiometry } from '@/features/biometry';
import { BiometryDetailView } from '@/features/biometry/components';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function BiometryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: biometry, isLoading, error } = useBiometry(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !biometry) {
    return (
      <DashboardLayout>
        <NotFoundState message="Biometria não encontrada." backHref="/company/biometries" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <BiometryDetailView biometry={biometry} />
    </DashboardLayout>
  );
}
