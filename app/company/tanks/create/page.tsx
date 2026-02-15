'use client';

import { useCreateTank } from '@/features/tank';
import { DashboardLayout } from '@/shared/components/Layout';
import type { CreateTankFormData } from '@/features/tank';
import { TankDocumentIcon } from '@/app/_components/AppIcons';
import { TankPageShell } from '../_components/TankPageShell';
import { TankUpsertForm } from '../_components/TankUpsertForm';

export default function NewTankPage() {
  const createTank = useCreateTank();

  const onSubmit = (data: CreateTankFormData) => {
    // UI de fotos (não enviado no payload por enquanto)
    createTank.mutate(data);
  };

  return (
    <DashboardLayout
      user={{
        name: 'Usuário Demo',
        email: 'demo@dev.com',
      }}
    >
      <TankPageShell
        breadcrumb="Dashboard / Tanques / Novo"
        title="Tanque"
        subtitle="Cadastro de tanque para monitoramento aquícola"
        icon={<TankDocumentIcon className="h-6 w-6 text-[#0EA5A4]" />}
      >
        <TankUpsertForm
          onSubmit={onSubmit}
          isSubmitting={createTank.isPending}
          submitLabel="Criar Tanque"
          submittingLabel="Criando..."
        />
      </TankPageShell>
    </DashboardLayout>
  );
}
