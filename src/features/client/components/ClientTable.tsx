'use client';

import type { Client } from '../types';
import {
  DataTable,
  createCrudListRowActions,
  type DataTableColumn,
} from '@/shared/components/Table';
import { maskCpfCnpj } from '@/shared/utils/documentMask';
import { maskPhone } from '@/shared/utils/phoneMask';

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
    case 'consumer':
      return 'Consumidor';
    default:
      return value || '—';
  }
}

export function ClientTable({
  clients,
  onDelete,
  isDeleting = false,
}: {
  clients: Client[];
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
}) {
  const columns: Array<DataTableColumn<Client>> = [
    {
      id: 'name',
      header: 'Cliente',
      cell: (row) => <div className="text-sm font-medium text-[#0F172A]">{row.name}</div>,
    },
    {
      id: 'personType',
      header: 'Tipo',
      cell: (row) => (
        <div className="text-sm text-slate-600">{personTypeLabel(row.personType)}</div>
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
      id: 'email',
      header: 'E-mail',
      cell: (row) => <div className="text-sm text-slate-600">{row.email || '—'}</div>,
    },
    {
      id: 'phone',
      header: 'Telefone',
      cell: (row) => (
        <div className="text-sm text-slate-600">{row.phone ? maskPhone(row.phone) : '—'}</div>
      ),
    },
    {
      id: 'contact',
      header: 'Contato',
      cell: (row) => (
        <div className="text-sm text-slate-600">
          {row.contact ? maskPhone(row.contact) : row.contact || '—'}
        </div>
      ),
    },
    {
      id: 'priceGroup',
      header: 'Grupo de preço',
      cell: (row) => (
        <div className="text-sm text-slate-600">{priceGroupLabel(row.priceGroup)}</div>
      ),
    },
    {
      id: 'isDefaulter',
      header: 'Inadimplente',
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            row.isDefaulter ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {row.isDefaulter ? 'Sim' : 'Não'}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={clients}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={createCrudListRowActions({
        basePath: '/company/clients',
        onDelete,
        getRowLabel: (row) => row.name || 'Cliente',
        isDeleting,
      })}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum cliente encontrado.</div>}
    />
  );
}
