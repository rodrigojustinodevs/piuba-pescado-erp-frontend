'use client';

import type { Client } from '../types';
import {
  DetailPageHero,
  EntityDetailMetricsBody,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { maskCpfCnpj } from '@/shared/utils/documentMask';
import { maskPhone } from '@/shared/utils/phoneMask';

type ClientDetailViewProps = {
  client: Client;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
};

function personTypeLabel(value: Client['personType']): string {
  return value === 'company' ? 'Pessoa jurídica' : 'Pessoa física';
}

function priceGroupLabel(value: Client['priceGroup']): string {
  const key = value?.toLowerCase?.() ?? '';
  switch (key) {
    case 'wholesale':
      return 'Atacado';
    case 'retail':
      return 'Varejo';
    default:
      return value || '—';
  }
}

export function ClientDetailView({
  client,
  onDelete,
  isDeleting = false,
}: Readonly<ClientDetailViewProps>) {
  const titleLabel = client.name || 'Cliente';
  const metricCards = [
    { label: 'Cliente', value: client.name || '—' },
    { label: 'Tipo', value: personTypeLabel(client.personType) },
    { label: 'Documento', value: client.documentNumber ? maskCpfCnpj(client.documentNumber) : '—' },
    { label: 'Grupo de preço', value: priceGroupLabel(client.priceGroup) },
  ];
  const infoItems = [
    { label: 'E-MAIL', value: client.email || '—' },
    { label: 'TELEFONE', value: client.phone ? maskPhone(client.phone) : '—' },
    { label: 'CONTATO', value: client.contact ? maskPhone(client.contact) : '—' },
    { label: 'ENDEREÇO', value: client.address || '—' },
    { label: 'LIMITE DE CRÉDITO', value: client.creditLimit || '—' },
    { label: 'INADIMPLENTE', value: client.isDefaulter ? 'Sim' : 'Não' },
    { label: 'EMPRESA', value: client.companyName || '—' },
    { label: 'CRIADO EM', value: formatNullableDatePtBR(client.createdAt, true) },
    { label: 'ATUALIZADO EM', value: formatNullableDatePtBR(client.updatedAt, true) },
  ];

  return (
    <EntityDetailShell breadcrumb={<>Dashboard / Clientes / {titleLabel}</>}>
      <DetailPageHero
        icon={<OrdersIcon />}
        title={titleLabel}
        subtitle={
          <>
            Tipo: {personTypeLabel(client.personType)} · Grupo: {priceGroupLabel(client.priceGroup)}
          </>
        }
        editHref={`/company/clients/${client.id}/edit`}
        onDeleteClick={onDelete ? () => onDelete(client.id, titleLabel) : undefined}
        isDeleting={isDeleting}
      />
      <EntityDetailMetricsBody metricCards={metricCards} infoSectionTitle="Detalhes" infoItems={infoItems} />
    </EntityDetailShell>
  );
}

