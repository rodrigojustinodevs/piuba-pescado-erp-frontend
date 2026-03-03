'use client';

import { useRouter } from 'next/navigation';
import { useCreateBiometry } from '@/features/biometry';
import { BiometryForm, BiometryPageShell } from '@/features/biometry/components';
import type { CreateBiometryFormData } from '@/features/biometry';
import { BiometryIcon } from '@/shared/components/Sidebar/menuIcons';
import { DashboardLayout } from '@/shared/components/Layout';

export default function NewBiometryPage() {
  const router = useRouter();
  const createBiometry = useCreateBiometry();

  const onSubmit = (data: CreateBiometryFormData) => {
    createBiometry.mutate(data, {
      onSuccess: () => {
        router.push('/company/biometries');
      },
      onError: (error) => {
        console.error('[CreateBiometry]', error);
      },
    });
  };

  return (
    <DashboardLayout>
      <BiometryPageShell
        breadcrumb="Dashboard / Biometrias / Nova"
        title="Biometria"
        subtitle="Registro de biometria por lote"
        icon={
          <span className="inline-block text-[#0EA5A4]">
            <BiometryIcon />
          </span>
        }
      >
        <BiometryForm
          onSubmit={onSubmit}
          isSubmitting={createBiometry.isPending}
          submitLabel="Criar Biometria"
          submittingLabel="Criando..."
        />
      </BiometryPageShell>
    </DashboardLayout>
  );
}
