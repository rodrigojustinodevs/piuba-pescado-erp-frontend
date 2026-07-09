'use client';

import { Building2, Mail, Phone, User, FileText, Star } from 'lucide-react';
import type { Supplier, SupplierStatus } from '../types';
import { maskCpfCnpj } from '@/shared/utils/documentMask';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Separator } from '@/src/shared/components/ui/Separator';
import { Badge } from '@/src/shared/components/ui/Badge';
import { formatCurrency } from '@/shared/utils/numberFormat';
import { DetailItem } from '@/shared/components/ui/DetailItem';

type SupplierViewDialogContentProps = {
  supplier: Supplier | null;
};

const STATUS_STYLES: Record<SupplierStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  inactive: 'bg-muted text-muted-foreground border-border',
  suspended: 'bg-rose-500/15 text-rose-700 border-rose-500/30',
};

const STATUS_LABELS: Record<SupplierStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  suspended: 'Suspenso',
};

function formatAddress(supplier: Supplier): string {
  const { street, number, neighborhood, city, state, zipCode } = supplier.address;
  const line1 = [street, number].filter(Boolean).join(', ');
  const line2 = [neighborhood, [city, state].filter(Boolean).join('/')].filter(Boolean).join(' - ');
  const parts = [line1, line2, zipCode].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : '—';
}

export function SupplierViewDialogContent({ supplier }: Readonly<SupplierViewDialogContentProps>) {
  if (!supplier) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <Building2 className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{supplier.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              {supplier.tradeName ?? supplier.companyName ?? '—'}
            </span>
            <Badge variant="outline" className={STATUS_STYLES[supplier.status]}>
              {STATUS_LABELS[supplier.status]}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div>
          <p className="text-xs text-slate-500">Total comprado</p>
          <p className="text-base font-semibold text-slate-800">
            {formatCurrency(supplier.totalPurchases)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Última compra</p>
          <p className="text-sm font-medium text-slate-700">
            {formatNullableDatePtBR(supplier.lastPurchaseAt, false)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {supplier.rating == null ? (
            <span className="text-sm text-slate-400">Sem avaliação</span>
          ) : (
            Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(supplier.rating ?? 0)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            ))
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Detalhes do Fornecedor</p>
        <div className="grid grid-cols-2 gap-2">
          <DetailItem
            icon={<FileText className="h-4 w-4" />}
            label="CPF/CNPJ"
            value={supplier.document ? maskCpfCnpj(supplier.document) : '—'}
          />
          <DetailItem
            icon={<FileText className="h-4 w-4" />}
            label="Inscrição Estadual"
            value={supplier.stateRegistration ?? '—'}
          />
          <DetailItem
            icon={<FileText className="h-4 w-4" />}
            label="Categoria"
            value={supplier.categoryLabel ?? '—'}
          />
          <DetailItem
            icon={<FileText className="h-4 w-4" />}
            label="Forma de pagamento"
            value={supplier.paymentTerms ?? '—'}
          />
          <DetailItem
            icon={<User className="h-4 w-4" />}
            label="Nome do contato"
            value={supplier.contactName ?? '—'}
          />
          <DetailItem
            icon={<Phone className="h-4 w-4" />}
            label="Telefone"
            value={supplier.phone ?? '—'}
          />
          <DetailItem
            icon={<Mail className="h-4 w-4" />}
            label="E-mail"
            value={supplier.email ?? '—'}
          />
          <DetailItem
            icon={<Building2 className="h-4 w-4" />}
            label="Endereço"
            value={formatAddress(supplier)}
          />
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>Criado em: {formatNullableDatePtBR(supplier.createdAt, true)}</span>
        <span>Atualizado em: {formatNullableDatePtBR(supplier.updatedAt, true)}</span>
      </div>
    </div>
  );
}
