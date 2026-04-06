'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { SaleEditForm, useSale, useUpdateSale } from '@/features/sale';
import { saleUpdateStatusValues } from '@/features/sale/schemas';
import type { UpdateSaleFormData } from '@/features/sale/schemas';
import type { Sale, UpdateSaleData } from '@/features/sale/types';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

function saleToUpdateFormValues(sale: Sale): UpdateSaleFormData {
  const status = (saleUpdateStatusValues as readonly string[]).includes(sale.status)
    ? (sale.status as UpdateSaleFormData['status'])
    : 'pending';
  const saleDate = sale.saleDate.slice(0, 10);
  return {
    totalWeight: sale.totalWeight,
    pricePerKg: sale.pricePerKg,
    saleDate,
    status,
    notes: sale.notes ?? '',
    isTotalHarvest: sale.isTotalHarvest,
  };
}

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
        <SaleEditForm
          readOnlyContext={{
            clientName: sale.clientName,
            batchName: sale.batchName,
            stockingId: sale.stockingId,
            financialCategoryId: sale.financialCategoryId,
          }}
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
