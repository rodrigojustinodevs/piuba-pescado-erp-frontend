'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTank, useUpdateTank } from '@/features/tank';
import type { CreateTankFormData } from '@/features/tank';

import { DemoDashboardLayout } from '@/app/_components/DemoDashboardLayout';
import { LoadingState, NotFoundState } from '@/app/_components/PageStates';
import { TankDocumentIcon } from '@/app/_components/AppIcons';
import { TankUpsertForm } from '../../_components/TankUpsertForm';
import { TankPageShell } from '../../_components/TankPageShell';

export default function EditTankPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: tank, isLoading } = useTank(id);
  const updateTank = useUpdateTank();

  const onSubmit = (data: CreateTankFormData) => {
    // UI de fotos (não enviado no payload por enquanto)
    updateTank.mutate({ ...data, id });
  };

  const initialValues = useMemo<CreateTankFormData | undefined>(() => {
    if (!tank) return undefined;
    return {
      companyId: tank.companyId,
      tankTypeId: tank.tankTypeId,
      name: tank.name,
      capacityLiters: tank.capacityLiters,
      location: tank.location || '',
      status: tank.status,
    };
  }, [tank]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!tank) {
    return <NotFoundState message="Tanque não encontrado." />;
  }

  return (
    <DemoDashboardLayout>
      <TankPageShell
        breadcrumb="Dashboard / Tanques / Editar"
        title="Tanque"
        subtitle="Atualize as informações do tanque para monitoramento aquícola"
        icon={<TankDocumentIcon className="h-6 w-6 text-[#0EA5A4]" />}
      >
        <TankUpsertForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={updateTank.isPending}
          submitLabel="Atualizar Tanque"
          submittingLabel="Atualizando..."
        />
      </TankPageShell>
    </DemoDashboardLayout>
  );
}
