'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  FinancialCategoryForm,
  useFinancialCategory,
  useUpdateFinancialCategory,
} from '@/features/financialCategory';
import type { CreateFinancialCategoryFormData } from '@/features/financialCategory/schemas';
import { financialCategoryStatusValues, financialCategoryTypeValues } from '@/features/financialCategory/schemas';
import type { CreateFinancialCategoryData, FinancialCategory } from '@/features/financialCategory/types';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

function categoryToFormValues(category: FinancialCategory): CreateFinancialCategoryFormData {
  const type = (financialCategoryTypeValues as readonly string[]).includes(category.type)
    ? (category.type as CreateFinancialCategoryFormData['type'])
    : financialCategoryTypeValues[0];
  const status = (financialCategoryStatusValues as readonly string[]).includes(category.status)
    ? (category.status as CreateFinancialCategoryFormData['status'])
    : financialCategoryStatusValues[0];
  return {
    companyId: category.companyId,
    name: category.name,
    type,
    status,
  };
}

export default function EditFinancialCategoryPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: category, isLoading } = useFinancialCategory(id);
  const updateCategory = useUpdateFinancialCategory();

  const onSubmit = (data: CreateFinancialCategoryData) => {
    updateCategory.mutate({ ...data, id });
  };

  const initialValues = useMemo<CreateFinancialCategoryFormData | undefined>(() => {
    if (!category) return undefined;
    return categoryToFormValues(category);
  }, [category]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!category) {
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
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Categorias financeiras / Editar"
          title="Categoria financeira"
          subtitle="Atualize nome, tipo e status"
          icon={<OrdersIcon />}
        />
        <FinancialCategoryForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isEdit={true}
          isSubmitting={updateCategory.isPending}
          submitLabel="Atualizar categoria"
          submittingLabel="Atualizando..."
        />
      </div>
    </DashboardLayout>
  );
}
