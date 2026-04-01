'use client';

import { useParams } from 'next/navigation';
import { useAlertModal } from '@/shared/components/AlertModal';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';
import { ClientDetailView } from '@/features/client/components';
import { useClient, useDeleteClient } from '@/features/client';

export default function ClientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: client, isLoading, error } = useClient(id);
  const deleteClient = useDeleteClient();
  const { showError } = useAlertModal();

  const handleDelete = (targetId: string, label: string) => {
    showError(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o cliente "${label}"? Esta ação não pode ser desfeita.`,
      'Sim, Excluir',
      () => deleteClient.mutate(targetId),
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !client) {
    return (
      <DashboardLayout>
        <NotFoundState message="Cliente não encontrado." backHref="/company/clients" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ClientDetailView
        client={client}
        onDelete={handleDelete}
        isDeleting={deleteClient.isPending}
      />
    </DashboardLayout>
  );
}

