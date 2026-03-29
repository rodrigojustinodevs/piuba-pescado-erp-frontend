'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useMortality, useUpdateMortality } from '@/features/mortality';
import type { CreateMortalityFormData } from '@/features/mortality/schemas';
import { MortalityPageShell } from '@/features/mortality/components';
import { MortalityForm, toDateInputValue } from '@/features/mortality/components/MortalityForm';
import { MortalityIcon } from '@/shared/components/Sidebar/menuIcons';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function EditMortalityPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: mortality, isLoading } = useMortality(id);
  const updateMortality = useUpdateMortality();

  const onSubmit = (data: {
    batchId: string;
    mortalityDate: string;
    quantity: number;
    cause: string;
  }) => {
    updateMortality.mutate({ ...data, id });
  };

  const initialValues = useMemo<CreateMortalityFormData | undefined>(() => {
    if (!mortality) return undefined;
    return {
      batchId: mortality.batchId,
      mortalityDate: toDateInputValue(mortality.mortalityDate),
      quantity: mortality.quantity,
      cause: mortality.cause,
    };
  }, [mortality]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!mortality) {
    return (
      <DashboardLayout>
        <NotFoundState message="Mortalidade não encontrada." backHref="/company/mortalities" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MortalityPageShell
        breadcrumb="Dashboard / Mortalidades / Editar"
        title="Mortalidade"
        subtitle="Atualize os dados da mortalidade"
        icon={
          <span className="inline-block text-[#0EA5A4]">
            <MortalityIcon />
          </span>
        }
      >
        <MortalityForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={updateMortality.isPending}
          submitLabel="Atualizar Mortalidade"
          submittingLabel="Atualizando..."
        />
      </MortalityPageShell>
    </DashboardLayout>
  );
}
