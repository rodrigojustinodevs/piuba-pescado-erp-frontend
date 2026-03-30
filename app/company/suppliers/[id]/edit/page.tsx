'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { SupplierForm, useSupplier, useUpdateSupplier } from '@/features/supplier';
import type { CreateSupplierFormData } from '@/features/supplier/schemas';
import type { CreateSupplierData, Supplier } from '@/features/supplier/types';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { BuildingIcon } from '@/shared/components/Sidebar/menuIcons';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

function supplierToFormValues(supplier: Supplier): CreateSupplierFormData {
  return {
    companyId: supplier.companyId,
    name: supplier.name,
    contact: supplier.contact ?? '',
    phone: supplier.phone ?? '',
    email: supplier.email ?? '',
  };
}

export default function EditSupplierPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: supplier, isLoading } = useSupplier(id);
  const updateSupplier = useUpdateSupplier();

  const onSubmit = (data: CreateSupplierData) => {
    updateSupplier.mutate({ ...data, id });
  };

  const initialValues = useMemo<CreateSupplierFormData | undefined>(() => {
    if (!supplier) return undefined;
    return supplierToFormValues(supplier);
  }, [supplier]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!supplier) {
    return (
      <DashboardLayout>
        <NotFoundState message="Fornecedor não encontrado." backHref="/company/suppliers" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Fornecedores / Editar"
          title="Fornecedor"
          subtitle="Atualize os dados do fornecedor"
          icon={<BuildingIcon />}
        />
        <SupplierForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={updateSupplier.isPending}
          submitLabel="Atualizar fornecedor"
          submittingLabel="Atualizando..."
        />
      </div>
    </DashboardLayout>
  );
}
