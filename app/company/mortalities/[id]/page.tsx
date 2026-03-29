'use client';

import { useParams } from 'next/navigation';
import { useDeleteMortality, useMortality } from '@/features/mortality';
import { MortalityDetailView } from '@/features/mortality/components';
import { DashboardLayout } from '@/shared/components/Layout';
import { useAlertModal } from '@/shared/components/AlertModal';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function MortalityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: mortality, isLoading, error } = useMortality(id);
  const deleteMortality = useDeleteMortality();
  const { showError } = useAlertModal();

  const handleDelete = (targetId: string, label: string) => {
    showError(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o registro "${label}"? Esta ação não pode ser desfeita.`,
      'Sim, Excluir',
      () => deleteMortality.mutate(targetId),
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !mortality) {
    return (
      <DashboardLayout>
        <NotFoundState message="Mortalidade não encontrada." backHref="/company/mortalities" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MortalityDetailView
        mortality={mortality}
        onDelete={handleDelete}
        isDeleting={deleteMortality.isPending}
      />
    </DashboardLayout>
  );
}
