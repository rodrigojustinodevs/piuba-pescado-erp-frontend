'use client';

import type { Client, ClientStatus } from '../types';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { maskCpfCnpj } from '@/shared/utils/documentMask';
import { maskPhone } from '@/shared/utils/phoneMask';
import { User, Eye, Pencil, Trash } from 'lucide-react';

function StatusBadge({ status }: { status: ClientStatus }) {
  const styles: Record<ClientStatus, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-slate-100 text-slate-600',
    prospect: 'bg-blue-100 text-blue-700',
  };
  const labels: Record<ClientStatus, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    prospect: 'Prospect',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function SegmentBadge({ value }: { value: string }) {
  const label = (() => {
    switch (value?.toLowerCase()) {
      case 'wholesale':
        return 'Atacado';
      case 'retail':
        return 'Varejo';
      case 'consumer':
        return 'Consumidor';
      default:
        return value || '—';
    }
  })();

  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
      {label}
    </span>
  );
}

function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
}

type ClientTableProps = {
  clients: Client[];
  getRowActions?: (row: Client) => DataTableAction[];
};

export function ClientTable({ clients, getRowActions }: Readonly<ClientTableProps>) {
  const columns: Array<DataTableColumn<Client>> = [
    {
      id: 'name',
      header: 'Cliente',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100">
            <User className="h-4 w-4 text-slate-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">{row.name}</div>
            {row.companyName && <div className="text-xs text-slate-400">{row.companyName}</div>}
          </div>
        </div>
      ),
    },
    {
      id: 'documentNumber',
      header: 'Documento',
      cell: (row) => (
        <div className="text-sm text-slate-600">
          {row.documentNumber ? maskCpfCnpj(row.documentNumber) : '—'}
        </div>
      ),
    },
    {
      id: 'contact',
      header: 'Contato',
      cell: (row) => (
        <div>
          {row.contact && <div className="text-sm text-slate-700">{row.contact}</div>}
          {row.phone && <div className="text-xs text-slate-400">{maskPhone(row.phone)}</div>}
          {!row.contact && !row.phone && <span className="text-sm text-slate-400">—</span>}
        </div>
      ),
    },
    {
      id: 'priceGroup',
      header: 'Segmento',
      cell: (row) => <SegmentBadge value={row.priceGroup} />,
    },
    {
      id: 'address',
      header: 'Cidade/UF',
      cell: (row) => <div className="text-sm text-slate-600">{row.address ?? '—'}</div>,
    },
    {
      id: 'creditLimit',
      header: 'Limite',
      cell: (row) => (
        <div className="text-sm text-slate-700">{formatCurrency(row.creditLimit)}</div>
      ),
    },
    {
      id: 'purchaseTotal',
      header: 'Venda Total',
      cell: (row) => (
        <div className="text-sm text-slate-700">{formatCurrency(row.purchaseTotal)}</div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <DataTable
      data={clients}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={getRowActions}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum cliente encontrado.</div>}
      showPagination={false}
    />
  );
}
