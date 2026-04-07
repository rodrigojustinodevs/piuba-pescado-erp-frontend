'use client';

import { useParams } from 'next/navigation';
import { useAlertModal } from '@/shared/components/AlertModal';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';
import { FinancialCategoryDetailView } from '@/features/financialCategory/components';
import {
  useActivateFinancialCategory,
  useDeactivateFinancialCategory,
  useDeleteFinancialCategory,
  useFinancialCategory,
} from '@/features/financialCategory';

export default function FinancialCategoryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: category, isLoading, error } = useFinancialCategory(id);
  const deleteCategory = useDeleteFinancialCategory();
  const activateCategory = useActivateFinancialCategory();
  const deactivateCategory = useDeactivateFinancialCategory();
  const { showError } = useAlertModal();

  const handleDelete = (targetId: string, label: string) => {
    showError(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir a categoria "${label}"? Esta ação não pode ser desfeita.`,
      'Sim, excluir',
      () => deleteCategory.mutate(targetId),
    );
  };

  const handleActivate = (targetId: string, label: string) => {
    showError('Confirmar ativação', `Deseja ativar a categoria "${label}"?`, 'Sim, ativar', () =>
      activateCategory.mutate(targetId),
    );
  };

  const handleDeactivate = (targetId: string, label: string) => {
    showError(
      'Confirmar inativação',
      `Deseja inativar a categoria "${label}"?`,
      'Sim, inativar',
      () => deactivateCategory.mutate(targetId),
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !category) {
    return (
      <DashboardLayout>
        <NotFoundState
          message="Categoria financeira não encontrada."
          backHref="/company/financial-categories"
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <FinancialCategoryDetailView
        category={category}
        onDelete={handleDelete}
        isDeleting={deleteCategory.isPending}
        onActivate={handleActivate}
        isActivating={activateCategory.isPending}
        onDeactivate={handleDeactivate}
        isDeactivating={deactivateCategory.isPending}
      />
    </DashboardLayout>
  );
}
