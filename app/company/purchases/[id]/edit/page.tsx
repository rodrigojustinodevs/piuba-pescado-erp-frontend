'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { PurchaseForm, usePurchase, useUpdatePurchase } from '@/features/purchase';
import type { CreatePurchaseFormData } from '@/features/purchase/schemas';
import type { CreatePurchaseData, Purchase } from '@/features/purchase/types';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';

const EDITABLE_STATUS_OPTIONS: Array<CreatePurchaseFormData['status']> = ['draft', 'confirmed'];

function purchaseToFormValues(purchase: Purchase): CreatePurchaseFormData {
  return {
    companyId: purchase.companyId,
    supplierId: purchase.supplierId,
    invoiceNumber: purchase.invoiceNumber ?? '',
    purchaseDate: purchase.purchaseDate,
    status: purchase.status as CreatePurchaseFormData['status'],
    items: purchase.items.map((item) => ({
      supplyId: item.supplyId,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
    })),
  };
}

export default function EditPurchasePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: purchase, isLoading } = usePurchase(id);
  const updatePurchase = useUpdatePurchase();

  const onSubmit = (data: CreatePurchaseData) => {
    updatePurchase.mutate({ ...data, id });
  };

  const initialValues = useMemo<CreatePurchaseFormData | undefined>(() => {
    if (!purchase) return undefined;
    return purchaseToFormValues(purchase);
  }, [purchase]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!purchase) {
    return (
      <DashboardLayout>
        <NotFoundState message="Compra não encontrada." backHref="/company/purchases" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Compras / Editar"
          title="Compra"
          subtitle="Atualize os dados da compra"
          icon={<OrdersIcon />}
        />
        <PurchaseForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={updatePurchase.isPending}
          submitLabel="Atualizar compra"
          submittingLabel="Atualizando..."
          statusOptions={EDITABLE_STATUS_OPTIONS}
        />
      </div>
    </DashboardLayout>
  );
}
