'use client';

import {
  Building2,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Star,
  Tag,
  User,
} from 'lucide-react';
import type { Supplier, SupplierStatus } from '../types';
import { maskCpfCnpj } from '@/shared/utils/documentMask';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { formatCurrency } from '@/shared/utils/numberFormat';
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
import { cn } from '@/shared/lib/utils';

type SupplierDetailsDialogProps = {
  readonly supplier: Supplier | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const SUPPLIER_STATUS: Record<SupplierStatus, { label: string; tone: DetailTone }> = {
  active: { label: 'Ativo', tone: 'success' },
  inactive: { label: 'Inativo', tone: 'neutral' },
  suspended: { label: 'Suspenso', tone: 'danger' },
};

function formatAddress(supplier: Supplier): string | null {
  const { street, number, neighborhood, city, state, zipCode } = supplier.address;
  const line1 = [street, number].filter(Boolean).join(', ');
  const line2 = [neighborhood, [city, state].filter(Boolean).join('/')].filter(Boolean).join(' - ');
  const parts = [line1, line2, zipCode].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : null;
}

function Rating({ value }: Readonly<{ value: number }>) {
  const rounded = Math.round(value);
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`${rounded} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            'size-4',
            i < rounded ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40',
          )}
        />
      ))}
    </span>
  );
}

function SupplierDetailsBody({ supplier }: Readonly<{ supplier: Supplier }>) {
  const status = SUPPLIER_STATUS[supplier.status] ?? { label: 'Desconhecido', tone: 'neutral' };
  const subtitle = supplier.tradeName ?? supplier.companyName;

  return (
    <DetailsDialogBody>
      <DetailsHero icon={Building2} title={supplier.name} tone={status.tone}>
        <DetailsStatusBadge tone={status.tone} label={status.label} />
        <DetailsCopyId id={supplier.id} label="ID do fornecedor" />
        {subtitle && (
          <span className="min-w-0 truncate text-xs text-muted-foreground">{subtitle}</span>
        )}
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile
          icon={Receipt}
          label="Total comprado"
          hint={
            supplier.lastPurchaseAt
              ? `Última compra em ${formatNullableDatePtBR(supplier.lastPurchaseAt)}`
              : 'Nenhuma compra registrada'
          }
        >
          <span className="text-xl tabular-nums">{formatCurrency(supplier.totalPurchases)}</span>
        </DetailsTile>
        <DetailsTile icon={Star} label="Avaliação" emptyLabel="Sem avaliação">
          {supplier.rating == null ? null : <Rating value={supplier.rating} />}
        </DetailsTile>
        <DetailsTile icon={FileText} label="CPF/CNPJ">
          {supplier.document ? maskCpfCnpj(supplier.document) : null}
        </DetailsTile>
        <DetailsTile icon={FileText} label="Inscrição estadual" emptyLabel="Não informada">
          {supplier.stateRegistration}
        </DetailsTile>
        <DetailsTile icon={Tag} label="Categoria" emptyLabel="Não informada">
          {supplier.categoryLabel}
        </DetailsTile>
        <DetailsTile icon={CreditCard} label="Forma de pagamento" emptyLabel="Não informada">
          {supplier.paymentTerms}
        </DetailsTile>
        <DetailsTile icon={User} label="Contato">
          {supplier.contactName}
        </DetailsTile>
        <DetailsTile icon={Phone} label="Telefone">
          {supplier.phone}
        </DetailsTile>
        <DetailsTile icon={Mail} label="E-mail" span={2}>
          {supplier.email}
        </DetailsTile>
        <DetailsTile icon={MapPin} label="Endereço" span={2}>
          {formatAddress(supplier)}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={supplier.createdAt} updatedAt={supplier.updatedAt} />
    </DetailsDialogBody>
  );
}

export function SupplierDetailsDialog({
  supplier,
  open,
  onOpenChange,
  onEdit,
}: SupplierDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={supplier ? `Detalhes do fornecedor ${supplier.name}` : 'Detalhes do fornecedor'}
      description="Informações cadastrais do fornecedor."
    >
      {supplier ? <SupplierDetailsBody supplier={supplier} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={supplier ? onEdit : undefined}
        editLabel="Editar fornecedor"
      />
    </DetailsDialog>
  );
}
