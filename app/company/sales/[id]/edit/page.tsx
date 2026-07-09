'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { SaleForm, saleToUpdateFormValues, useSale, useUpdateSale } from '@/features/sale';
import type { UpdateSaleFormData } from '@/features/sale/schemas';
import type { UpdateSaleData } from '@/features/sale/types';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function EditSalePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: sale, isLoading } = useSale(id);
  const updateSale = useUpdateSale();

  const onSubmit = (data: Omit<UpdateSaleData, 'id'>) => {
    updateSale.mutate({ ...data, id });
  };

  const initialValues = useMemo<UpdateSaleFormData | undefined>(() => {
    if (!sale) return undefined;
    return saleToUpdateFormValues(sale);
  }, [sale]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!sale) {
    return (
      <DashboardLayout>
        <NotFoundState message="Venda não encontrada." backHref="/company/sales" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Vendas / Editar"
          title="Venda"
          subtitle="Atualize os dados da venda"
          icon={<OrdersIcon />}
        />
        <SaleForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={updateSale.isPending}
          submitLabel="Atualizar venda"
          submittingLabel="Atualizando..."
        />
      </div>
    </DashboardLayout>
  );
}
