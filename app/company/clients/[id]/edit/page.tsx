'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/shared/components/Layout';
import { PageHeader } from '@/shared/components/ui';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';
import { ClientForm, useClient, useUpdateClient } from '@/features/client';
import type { CreateClientFormData } from '@/features/client/schemas';
import type { Client, CreateClientData } from '@/features/client/types';

function clientToFormValues(client: Client): CreateClientFormData {
  return {
    companyId: client.companyId ?? '',
    name: client.name,
    personType: client.personType,
    documentNumber: client.documentNumber ?? '',
    email: client.email ?? '',
    phone: client.phone ?? '',
    contact: client.contact ?? '',
    address: client.address ?? '',
    creditLimit: client.creditLimit ? Number(client.creditLimit) : 0,
    priceGroup: client.priceGroup as CreateClientFormData['priceGroup'],
  };
}

export default function EditClientPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: client, isLoading } = useClient(id);
  const updateClient = useUpdateClient();

  const onSubmit = (data: CreateClientData) => {
    updateClient.mutate({ ...data, id });
  };

  const initialValues = useMemo<CreateClientFormData | undefined>(() => {
    if (!client) return undefined;
    return clientToFormValues(client);
  }, [client]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout>
        <NotFoundState message="Cliente não encontrado." backHref="/company/clients" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Clientes / Editar"
          title="Cliente"
          subtitle="Atualize os dados do cliente"
          icon={<OrdersIcon />}
        />
        <ClientForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={updateClient.isPending}
          submitLabel="Atualizar cliente"
          submittingLabel="Atualizando..."
        />
      </div>
    </DashboardLayout>
  );
}

