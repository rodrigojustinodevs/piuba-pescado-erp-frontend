'use client';

import { Building2, FileText, Mail, MapPin, Phone } from 'lucide-react';
import type { Company } from '../types';
import { maskCpfCnpj } from '@/shared/utils/documentMask';
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

type CompanyDetailsDialogProps = {
  readonly company: Company | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const COMPANY_STATUS: Record<string, { label: string; tone: DetailTone }> = {
  active: { label: 'Ativo', tone: 'success' },
  inactive: { label: 'Inativo', tone: 'neutral' },
  suspended: { label: 'Suspenso', tone: 'danger' },
};

function formatAddress(address: Company['address'] | undefined): string | null {
  if (!address) return null;
  const parts = [
    [address.street, address.number].filter(Boolean).join(', '),
    address.complement,
    address.neighborhood,
    [address.city, address.state].filter(Boolean).join('/'),
    address.zipCode,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : null;
}

function CompanyDetailsBody({ company }: Readonly<{ company: Company }>) {
  const status = COMPANY_STATUS[company.status] ?? COMPANY_STATUS.inactive;

  return (
    <DetailsDialogBody>
      <DetailsHero icon={Building2} title={company.name} tone={status.tone}>
        <DetailsStatusBadge tone={status.tone} label={status.label} />
        <DetailsCopyId id={company.id} label="ID da empresa" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={FileText} label="CNPJ" span={2}>
          {company.cnpj && (
            <span className="font-mono tabular-nums" translate="no">
              {maskCpfCnpj(company.cnpj)}
            </span>
          )}
        </DetailsTile>
        <DetailsTile icon={Mail} label="E-mail">
          {company.email && <span translate="no">{company.email}</span>}
        </DetailsTile>
        <DetailsTile icon={Phone} label="Telefone">
          {company.phone}
        </DetailsTile>
        <DetailsTile icon={MapPin} label="Endereço" span={2}>
          {formatAddress(company.address)}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={company.createdAt} updatedAt={company.updatedAt} />
    </DetailsDialogBody>
  );
}

export function CompanyDetailsDialog({
  company,
  open,
  onOpenChange,
  onEdit,
}: CompanyDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={company ? `Detalhes da empresa ${company.name}` : 'Detalhes da empresa'}
      description="Dados cadastrais da empresa."
    >
      {company ? <CompanyDetailsBody company={company} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={company ? onEdit : undefined}
        editLabel="Editar empresa"
      />
    </DetailsDialog>
  );
}
