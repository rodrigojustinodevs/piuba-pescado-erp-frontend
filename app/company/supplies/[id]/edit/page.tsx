'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { SupplyForm, useSupply, useUpdateSupply } from '@/features/supply';
import type { CreateSupplyFormData } from '@/features/supply/schemas';
import type { CreateSupplyData, Supply } from '@/features/supply/types';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { ProductsIcon } from '@/shared/components/Sidebar/menuIcons';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

function supplyToFormValues(supply: Supply): CreateSupplyFormData {
  return {
    companyId: supply.companyId,
    name: supply.name,
    category: supply.category ?? '',
    defaultUnit: supply.defaultUnit as CreateSupplyFormData['defaultUnit'],
  };
}

export default function EditSupplyPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: supply, isLoading } = useSupply(id);
  const updateSupply = useUpdateSupply();

  const onSubmit = (data: CreateSupplyData) => {
    updateSupply.mutate({ ...data, id });
  };

  const initialValues = useMemo<CreateSupplyFormData | undefined>(() => {
    if (!supply) return undefined;
    return supplyToFormValues(supply);
  }, [supply]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!supply) {
    return (
      <DashboardLayout>
        <NotFoundState message="Produto não encontrado." backHref="/company/supplies" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Produtos / Editar"
          title="Produto"
          subtitle="Atualize os dados do produto"
          icon={<ProductsIcon />}
        />
        <SupplyForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={updateSupply.isPending}
          submitLabel="Atualizar produto"
          submittingLabel="Atualizando..."
        />
      </div>
    </DashboardLayout>
  );
}

