'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useBiometry, useUpdateBiometry } from '@/features/biometry';
import type { CreateBiometryFormData } from '@/features/biometry';
import { BiometryForm, BiometryPageShell } from '@/features/biometry/components';
import { BiometryIcon } from '@/shared/components/Sidebar/menuIcons';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function EditBiometryPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: biometry, isLoading } = useBiometry(id);
  const updateBiometry = useUpdateBiometry();

  const onSubmit = (data: CreateBiometryFormData) => {
    updateBiometry.mutate({ ...data, id });
  };

  const initialValues = useMemo<CreateBiometryFormData | undefined>(() => {
    if (!biometry) return undefined;
    return {
      batchId: biometry.batchId,
      biometryDate: biometry.biometryDate?.split('T')[0] ?? biometry.biometryDate ?? '',
      averageWeight: biometry.averageWeight,
      fcr: biometry.fcr,
    };
  }, [biometry]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!biometry) {
    return (
      <DashboardLayout>
        <NotFoundState message="Biometria não encontrada." backHref="/company/biometries" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <BiometryPageShell
        breadcrumb="Dashboard / Biometrias / Editar"
        title="Biometria"
        subtitle="Atualize os dados da biometria"
        icon={
          <span className="inline-block text-[#0EA5A4]">
            <BiometryIcon />
          </span>
        }
      >
        <BiometryForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={updateBiometry.isPending}
          submitLabel="Atualizar Biometria"
          submittingLabel="Atualizando..."
        />
      </BiometryPageShell>
    </DashboardLayout>
  );
}
