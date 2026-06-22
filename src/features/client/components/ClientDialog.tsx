'use client';

import type { Client, ClientDialogMode, CreateClientData, UpdateClientData } from '../types';
import { clientPriceGroupValues, clientStatusFormValues, type CreateClientFormData } from '../schemas';
import { ClientForm } from './ClientForm';
import { ClientViewDialogContent } from './ClientViewDialogContent';
import { useCreateClient } from '../hooks/useCreateClient';
import { useUpdateClient } from '../hooks/useUpdateClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';

type ClientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ClientDialogMode;
  client: Client | null;
  onSuccess: () => void;
};

type PriceGroupValue = (typeof clientPriceGroupValues)[number];
type StatusValue = (typeof clientStatusFormValues)[number];

function safePriceGroup(value: string): PriceGroupValue {
  return (clientPriceGroupValues as readonly string[]).includes(value)
    ? (value as PriceGroupValue)
    : clientPriceGroupValues[0];
}

function safeClientStatus(value: string): StatusValue {
  return (clientStatusFormValues as readonly string[]).includes(value)
    ? (value as StatusValue)
    : clientStatusFormValues[0];
}

function buildEditValues(client: Client): CreateClientFormData {
  return {
    companyId: client.companyId ?? '',
    personType: client.personType,
    name: client.name,
    tradeName: client.tradeName ?? '',
    documentNumber: client.documentNumber ?? '',
    contact: client.contact ?? '',
    email: client.email ?? '',
    phone: client.phone ?? '',
    priceGroup: safePriceGroup(client.priceGroup),
    city: client.city ?? '',
    state: client.state ?? '',
    status: safeClientStatus(client.status),
    creditLimit: client.creditLimit ? parseFloat(client.creditLimit) : 0,
    notes: client.notes ?? '',
  };
}

const DIALOG_CONFIG = {
  view: {
    title: 'Detalhes do cliente',
    description: 'Visualize as informações registradas neste cliente.',
    maxWidth: 'sm:max-w-2xl',
  },
  edit: {
    title: 'Editar cliente',
    description: 'Atualize os dados do cliente.',
    maxWidth: 'sm:max-w-2xl',
  },
  create: {
    title: 'Novo Cliente',
    description: 'Cadastre um novo cliente pessoa física ou jurídica.',
    maxWidth: 'sm:max-w-2xl',
  },
} satisfies Record<ClientDialogMode, { title: string; description: string; maxWidth: string }>;

export function ClientDialog({
  open,
  onOpenChange,
  mode,
  client,
  onSuccess,
}: Readonly<ClientDialogProps>) {
  const createClient = useCreateClient({ skipNavigateToList: true });
  const updateClient = useUpdateClient({ skipNavigateToList: true });

  const isViewMode = mode === 'view';
  const isLoading = createClient.isPending || updateClient.isPending;
  const { title, description, maxWidth } = DIALOG_CONFIG[mode];

  function handleClose() {
    onOpenChange(false);
  }

  function handleCreate(data: CreateClientData) {
    createClient.mutate(data, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  function handleUpdate(data: CreateClientData) {
    if (!client?.id) return;
    updateClient.mutate({ ...data, id: client.id }, {
      onSuccess: () => {
        onSuccess();
        handleClose();
      },
    });
  }

  const editInitialValues = client && mode === 'edit' ? buildEditValues(client) : undefined;

  function renderDialogContent() {
    if (isViewMode) {
      return (
        <>
          <ClientViewDialogContent client={client} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Fechar
            </Button>
          </DialogFooter>
        </>
      );
    }
    if (mode === 'edit' && client) {
      return (
        <ClientForm
          key={`edit-${client.id}-${open ? 'open' : 'closed'}`}
          initialValues={editInitialValues}
          onSubmit={handleUpdate}
          onCancel={handleClose}
          isSubmitting={isLoading}
          submitLabel="Atualizar cliente"
          submittingLabel="Atualizando..."
          inDialog
        />
      );
    }
    return (
      <ClientForm
        key={`create-${open ? 'open' : 'closed'}`}
        onSubmit={handleCreate}
        onCancel={handleClose}
        isSubmitting={isLoading}
        submitLabel="Cadastrar cliente"
        submittingLabel="Cadastrando..."
        inDialog
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-h-[90vh] overflow-y-auto bg-white ${maxWidth}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
}
