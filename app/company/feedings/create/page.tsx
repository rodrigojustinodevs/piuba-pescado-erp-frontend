'use client';

import { useRouter } from 'next/navigation';
import { useCreateFeeding } from '@/features/feeding';
import { FeedingForm, FeedingPageShell } from '@/features/feeding/components';
import type { CreateFeedingData } from '@/features/feeding/types';
import { FeedingIcon } from '@/shared/components/Sidebar/menuIcons';
import { DashboardLayout } from '@/shared/components/Layout';

export default function NewFeedingPage() {
  const router = useRouter();
  const createFeeding = useCreateFeeding();

  const onSubmit = (data: CreateFeedingData) => {
    createFeeding.mutate(data, {
      onSuccess: () => {
        router.push('/company/feedings');
      },
      onError: (error) => {
        console.error('[CreateFeeding]', error);
      },
    });
  };

  return (
    <DashboardLayout>
      <FeedingPageShell
        breadcrumb="Dashboard / Alimentações / Nova"
        title="Alimentação"
        subtitle="Registro de alimentação por lote"
        icon={
          <span className="inline-block text-[#0EA5A4]">
            <FeedingIcon />
          </span>
        }
      >
        <FeedingForm
          onSubmit={onSubmit}
          isSubmitting={createFeeding.isPending}
          submitLabel="Criar Alimentação"
          submittingLabel="Criando..."
        />
      </FeedingPageShell>
    </DashboardLayout>
  );
}
