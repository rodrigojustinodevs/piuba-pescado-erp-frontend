'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useFeeding, useUpdateFeeding } from '@/features/feeding';
import type { CreateFeedingFormData } from '@/features/feeding/schemas';
import { FeedingForm, FeedingPageShell } from '@/features/feeding/components';
import { toDateTimeLocalValue } from '@/features/feeding/components/FeedingForm';
import { FeedingIcon } from '@/shared/components/Sidebar/menuIcons';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function EditFeedingPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: feeding, isLoading } = useFeeding(id);
  const updateFeeding = useUpdateFeeding();

  const onSubmit = (data: {
    batchId: string;
    feedingDate: string;
    quantityProvided: number;
    feedType: string;
    stockReductionQuantity: number;
  }) => {
    updateFeeding.mutate({ ...data, id });
  };

  const initialValues = useMemo<CreateFeedingFormData | undefined>(() => {
    if (!feeding) return undefined;
    return {
      batchId: feeding.batchId,
      feedingDate: toDateTimeLocalValue(feeding.feedingDate),
      quantityProvided: feeding.quantityProvided,
      feedType: feeding.feedType,
      stockReductionQuantity: feeding.stockReductionQuantity,
    };
  }, [feeding]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!feeding) {
    return (
      <DashboardLayout>
        <NotFoundState message="Alimentação não encontrada." backHref="/company/feedings" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <FeedingPageShell
        breadcrumb="Dashboard / Alimentações / Editar"
        title="Alimentação"
        subtitle="Atualize os dados da alimentação"
        icon={
          <span className="inline-block text-[#0EA5A4]">
            <FeedingIcon />
          </span>
        }
      >
        <FeedingForm
          initialValues={initialValues}
          onSubmit={(data) => onSubmit({ ...data, id })}
          isSubmitting={updateFeeding.isPending}
          submitLabel="Atualizar Alimentação"
          submittingLabel="Atualizando..."
        />
      </FeedingPageShell>
    </DashboardLayout>
  );
}
