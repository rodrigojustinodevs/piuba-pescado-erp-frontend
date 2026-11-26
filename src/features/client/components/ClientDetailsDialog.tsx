'use client';

import { Building2, DollarSign, FileText, Mail, MapPin, Phone, Tag, User } from 'lucide-react';
import { CLIENT_STATUS_LABELS, type Client, type ClientStatus } from '../types';
import { maskCpfCnpj } from '@/shared/utils/documentMask';
import { maskPhone } from '@/shared/utils/phoneMask';
import {
  DetailsCopyId,
  DetailsDialog,
  DetailsDialogBody,
  DetailsDialogFooter,
  DetailsDialogSkeleton,
  DetailsGrid,
  DetailsHero,
  DetailsStatusBadge,
  DetailsTile,
  DetailsTimestamps,
  type DetailTone,
} from '@/shared/components/detailsDialog';

type ClientDetailsDialogProps = {
  readonly client: Client | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const CLIENT_STATUS_TONE: Record<ClientStatus, DetailTone> = {
  active: 'success',
  inactive: 'neutral',
  prospect: 'info',
};

const PRICE_GROUP_LABELS: Record<string, string> = {
  wholesale: 'Atacado',
  retail: 'Varejo',
  consumer: 'Consumidor',
};

const currencyFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function formatCreditLimit(value: string | null): string | null {
  if (!value) return null;
  const num = Number.parseFloat(value);
  if (Number.isNaN(num) || num <= 0) return null;
  return currencyFmt.format(num);
}

function priceGroupLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  return PRICE_GROUP_LABELS[value.toLowerCase()] ?? value;
}

function ClientDetailsBody({ client }: Readonly<{ client: Client }>) {
  const tone = CLIENT_STATUS_TONE[client.status] ?? 'neutral';
  const statusLabel = CLIENT_STATUS_LABELS[client.status] ?? 'Desconhecido';
  const personTypeLabel = client.personType === 'company' ? 'Pessoa Jurídica' : 'Pessoa Física';
  const creditLimit = formatCreditLimit(client.creditLimit);

  return (
    <DetailsDialogBody>
      <DetailsHero icon={User} title={client.name} tone={tone}>
        <DetailsStatusBadge tone={tone} label={statusLabel} />
        <DetailsCopyId id={client.id} label="ID do cliente" />
        <span className="text-xs text-muted-foreground">{personTypeLabel}</span>
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={DollarSign} label="Limite de crédito" emptyLabel="Sem limite">
          {creditLimit && <span className="text-xl tabular-nums">{creditLimit}</span>}
        </DetailsTile>
        <DetailsTile icon={Tag} label="Grupo de preço">
          {priceGroupLabel(client.priceGroup)}
        </DetailsTile>
        <DetailsTile icon={FileText} label="Documento">
          {client.documentNumber ? maskCpfCnpj(client.documentNumber) : null}
        </DetailsTile>
        <DetailsTile icon={Building2} label="Empresa" emptyLabel="Não informada">
          {client.companyName}
        </DetailsTile>
        <DetailsTile icon={Phone} label="Telefone">
          {client.phone ? maskPhone(client.phone) : null}
        </DetailsTile>
        <DetailsTile icon={User} label="Contato">
          {client.contact ? maskPhone(client.contact) : null}
        </DetailsTile>
        <DetailsTile icon={Mail} label="E-mail" span={2}>
          {client.email}
        </DetailsTile>
        <DetailsTile icon={MapPin} label="Endereço" span={2}>
          {client.address}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={client.createdAt} updatedAt={client.updatedAt} />
    </DetailsDialogBody>
  );
}

export function ClientDetailsDialog({
  client,
  open,
  onOpenChange,
  onEdit,
}: ClientDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={client ? `Detalhes do cliente ${client.name}` : 'Detalhes do cliente'}
      description="Informações cadastrais do cliente."
    >
      {client ? <ClientDetailsBody client={client} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={client ? onEdit : undefined}
        editLabel="Editar cliente"
      />
    </DetailsDialog>
  );
}
