'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { StockEditForm, useStock, useUpdateStock } from '@/features/stock';
import type { UpdateStockFormData } from '@/features/stock/schemas';
import type { Stock, UpdateStockPayload } from '@/features/stock/types';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { ProductsIcon } from '@/shared/components/Sidebar/menuIcons';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

function stockToEditFormValues(stock: Stock): UpdateStockFormData {
  return {
    supplierId: stock.supplierId ?? '',
    unit: stock.unit,
    unitPrice: stock.unitPrice,
    minimumStock: stock.minimumStock,
    withdrawalQuantity: stock.withdrawalQuantity,
  };
}

export default function EditStockPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: stock, isLoading } = useStock(id);
  const updateStock = useUpdateStock();

  const onSubmit = (data: UpdateStockPayload) => {
    updateStock.mutate({ ...data, id });
  };

  const initialValues = useMemo<UpdateStockFormData | undefined>(() => {
    if (!stock) return undefined;
    return stockToEditFormValues(stock);
  }, [stock]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!stock || !initialValues) {
    return (
      <DashboardLayout>
        <NotFoundState message="Estoque não encontrado." backHref="/company/stocks" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Estoques / Editar"
          title="Estoque"
          subtitle="Unidade, fornecedor, preço, estoque mínimo e retiradas"
          icon={<ProductsIcon />}
        />
        <StockEditForm
          lookupCompanyId={stock.companyId}
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={updateStock.isPending}
          submitLabel="Atualizar estoque"
          submittingLabel="Atualizando..."
        />
      </div>
    </DashboardLayout>
  );
}
