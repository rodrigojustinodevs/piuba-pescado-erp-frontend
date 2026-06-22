'use client';

import { Mail, Phone, MapPin, Star } from 'lucide-react';
import type { Supplier, SupplierStatus } from '../types';
import { maskCpfCnpj } from '@/shared/utils/documentMask';
import { DataTable, type DataTableColumn, type DataTableAction } from '@/shared/components/Table';
import { Badge } from '@/shared/components/ui/Badge';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatCity(supplier: Supplier): string {
  return [supplier.address.city, supplier.address.state].filter(Boolean).join('/') || '—';
}

const STATUS_STYLES: Record<SupplierStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  suspended: 'bg-rose-100 text-rose-700 border-rose-200',
};

const STATUS_LABELS: Record<SupplierStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  suspended: 'Suspenso',
};

function StatusBadge({ status }: Readonly<{ status: SupplierStatus }>) {
  return (
    <Badge variant="outline" className={STATUS_STYLES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

function RatingStars({ rating }: Readonly<{ rating: number | null }>) {
  if (rating == null) {
    return <span className="text-sm text-slate-400">—</span>;
  }
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-slate-600">{rating.toFixed(1)}</span>
    </div>
  );
}

interface SupplierTableProps {
  suppliers: Supplier[];
  getRowActions: (row: Supplier) => DataTableAction[];
}

const columns: Array<DataTableColumn<Supplier>> = [
    {
      id: 'name',
      header: 'Fornecedor',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">{row.name}</div>
            <div className="text-xs text-slate-400">
              {row.document ? maskCpfCnpj(row.document) : '—'}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Categoria',
      cell: (row) => (
        <div className="text-sm text-slate-600">
          {row.categoryLabel ? <Badge variant="secondary">{row.categoryLabel}</Badge> : '—'}
        </div>
      ),
    },
    {
      id: 'contact',
      header: 'Contato',
      cell: (row) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{row.email || '—'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{row.phone || '—'}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'location',
      header: 'Localização',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{formatCity(row)}</span>
        </div>
      ),
    },
    {
      id: 'rating',
      header: 'Avaliação',
      cell: (row) => <RatingStars rating={row.rating} />,
    },
    {
      id: 'totalPurchases',
      header: 'Total Comprado',
      align: 'right',
      cell: (row) => (
        <div className="text-sm font-medium text-slate-700">
          {formatCurrency(row.totalPurchases)}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
];

export function SupplierTable({ suppliers, getRowActions }: Readonly<SupplierTableProps>) {
  return (
    <DataTable
      data={suppliers}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={getRowActions}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum fornecedor encontrado.</div>}
    />
  );
}
