'use client';

import { useParams } from 'next/navigation';
import { useFeeding } from '@/features/feeding';
import { FeedingDetailView } from '@/features/feeding/components';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function FeedingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: feeding, isLoading, error } = useFeeding(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !feeding) {
    return (
      <DashboardLayout>
        <NotFoundState message="Alimentação não encontrada." backHref="/company/feedings" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <FeedingDetailView feeding={feeding} />
    </DashboardLayout>
  );
}
