'use client';

import { useRouter } from 'next/navigation';
import { useCreateTank } from '@/features/tank';
import { TankPageShell, TankUpsertForm } from '@/features/tank/components';
import { DashboardLayout } from '@/shared/components/Layout';
import type { CreateTankFormData } from '@/features/tank';
import { TankDocumentIcon } from '@/shared/components/icons/AppIcons';

export default function NewTankPage() {
  const router = useRouter();
  const createTank = useCreateTank();

  const onSubmit = (data: CreateTankFormData) => {
    // UI de fotos (não enviado no payload por enquanto)
    createTank.mutate(data, {
      onSuccess: () => {
        router.push('/company/tanks');
      },
      onError: (error) => {
        console.error('[CreateTank]', error);
      },
    });
  };

  return (
    <DashboardLayout>
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
