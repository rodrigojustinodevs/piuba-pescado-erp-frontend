'use client';

import {
  User,
  FileText,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Tag,
  Building2,
  Calendar,
} from 'lucide-react';
import { CLIENT_STATUS_LABELS, type Client, type ClientStatus } from '../types';
import { maskCpfCnpj } from '@/shared/utils/documentMask';
import { maskPhone } from '@/shared/utils/phoneMask';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Separator } from '@/src/shared/components/ui/Separator';
import { Badge } from '@/src/shared/components/ui/Badge';

type ClientViewDialogContentProps = {
  client: Client | null;
};

const STATUS_STYLES: Record<ClientStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  prospect: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
};

function formatCurrency(value: string | null): string {
  if (!value) return '—';
  const num = Number.parseFloat(value);
  if (Number.isNaN(num) || num <= 0) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
}

function priceGroupLabel(value: string): string {
  switch (value?.toLowerCase()) {
    case 'wholesale': return 'Atacado';
    case 'retail': return 'Varejo';
    case 'consumer': return 'Consumidor';
    default: return value || '—';
  }
}

function DetailItem({
  icon,
  label,
  value,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value: string;
}>) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-slate-400 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value || '—'}</p>
      </div>
    </div>
  );
}

export function ClientViewDialogContent({ client }: Readonly<ClientViewDialogContentProps>) {
  if (!client) return null;

  const personTypeLabel = client.personType === 'company' ? 'Pessoa Jurídica' : 'Pessoa Física';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
          <User className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{client.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{personTypeLabel}</span>
            <Badge variant="outline" className={STATUS_STYLES[client.status]}>
              {CLIENT_STATUS_LABELS[client.status]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Limite de Crédito</span>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(client.creditLimit)}</p>
          <p className="text-xs text-slate-400">crédito disponível</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Segmento</span>
            <Tag className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-xl font-bold text-slate-900">{priceGroupLabel(client.priceGroup)}</p>
          <p className="text-xs text-slate-400">grupo de preço</p>
        </div>
      </div>

      <Separator />

      {/* Detalhes de contato */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Informações de Contato</p>
        <div className="grid grid-cols-2 gap-2">
          <DetailItem
            icon={<FileText className="h-4 w-4" />}
            label="Documento"
            value={client.documentNumber ? maskCpfCnpj(client.documentNumber) : '—'}
          />
          <DetailItem
            icon={<Building2 className="h-4 w-4" />}
            label="Empresa"
            value={client.companyName || '—'}
          />
          <DetailItem
            icon={<Mail className="h-4 w-4" />}
            label="E-mail"
            value={client.email ?? '—'}
          />
          <DetailItem
            icon={<Phone className="h-4 w-4" />}
            label="Telefone"
            value={client.phone ? maskPhone(client.phone) : '—'}
          />
          <DetailItem
            icon={<User className="h-4 w-4" />}
            label="Contato"
            value={client.contact ? maskPhone(client.contact) : '—'}
          />
          <DetailItem
            icon={<MapPin className="h-4 w-4" />}
            label="Endereço"
            value={client.address ?? '—'}
          />
        </div>
      </div>

      <Separator />

      {/* Timestamps */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Criado em: {formatNullableDatePtBR(client.createdAt, true)}
        </span>
        <span>Atualizado em: {formatNullableDatePtBR(client.updatedAt, true)}</span>
      </div>
    </div>
  );
}
