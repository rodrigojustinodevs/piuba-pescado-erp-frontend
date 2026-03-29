'use client';

import { useRouter } from 'next/navigation';
import { useCreateMortality } from '@/features/mortality';
import { MortalityForm, MortalityPageShell } from '@/features/mortality/components';
import type { CreateMortalityData } from '@/features/mortality/types';
import { MortalityIcon } from '@/shared/components/Sidebar/menuIcons';
import { DashboardLayout } from '@/shared/components/Layout';

export default function NewMortalityPage() {
  const router = useRouter();
  const createMortality = useCreateMortality();

  const onSubmit = (data: CreateMortalityData) => {
    createMortality.mutate(data, {
      onSuccess: () => {
        router.push('/company/mortalities');
      },
      onError: (error) => {
        console.error('[CreateMortality]', error);
      },
    });
  };

  return (
    <DashboardLayout>
      <MortalityPageShell
        breadcrumb="Dashboard / Mortalidades / Nova"
        title="Mortalidade"
        subtitle="Registro de mortalidade por lote"
        icon={
          <span className="inline-block text-[#0EA5A4]">
            <MortalityIcon />
          </span>
        }
      >
        <MortalityForm
          onSubmit={onSubmit}
          isSubmitting={createMortality.isPending}
          submitLabel="Criar Mortalidade"
          submittingLabel="Criando..."
        />
      </MortalityPageShell>
    </DashboardLayout>
  );
}
