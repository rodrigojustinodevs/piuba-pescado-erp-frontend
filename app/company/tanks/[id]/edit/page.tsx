'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTank, useUpdateTank } from '@/features/tank';
import type { CreateTankFormData } from '@/features/tank';

import { DashboardLayout } from '@/shared/components/Layout';
import { demoUser } from '@/shared/constants/demoUser';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';
import { TankDocumentIcon } from '@/shared/components/icons/AppIcons';
import { TankPageShell, TankUpsertForm } from '@/features/tank/components';

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
      companyId: tank.company.id ?? '',
      tankTypeId: tank.tankType.id,
      name: tank.name,
      capacityLiters: tank.capacityLiters,
      location: tank.location || '',
      status: tank.status === 'maintenance' ? 'active' : tank.status,
    };
  }, [tank]);

  if (isLoading) {
    return (
      <DashboardLayout user={demoUser}>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!tank) {
    return (
      <DashboardLayout user={demoUser}>
        <NotFoundState message="Tanque não encontrado." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={demoUser}>
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
    </DashboardLayout>
  );
}
