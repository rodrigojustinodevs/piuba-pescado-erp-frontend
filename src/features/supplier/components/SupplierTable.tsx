'use client';

import type { Supplier } from '../types';
import { DataTable, createCrudListRowActions, type DataTableColumn } from '@/shared/components/Table';

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

interface SupplierTableProps {
  suppliers: Supplier[];
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
}

function getRowLabel(row: Supplier): string {
  return row.name || 'Fornecedor';
}

export function SupplierTable({
  suppliers,
  onDelete,
  isDeleting = false,
}: Readonly<SupplierTableProps>) {
  const columns: Array<DataTableColumn<Supplier>> = [
    {
      id: 'name',
      header: 'Fornecedor',
      cell: (row) => <div className="text-sm font-medium text-[#0F172A]">{row.name}</div>,
    },
    {
      id: 'contact',
      header: 'Contato',
      cell: (row) => <div className="text-sm text-slate-600">{row.contact || '—'}</div>,
    },
    {
      id: 'phone',
      header: 'Telefone',
      cell: (row) => <div className="text-sm text-slate-600">{row.phone || '—'}</div>,
    },
    {
      id: 'email',
      header: 'E-mail',
      cell: (row) => <div className="text-sm text-slate-600">{row.email || '—'}</div>,
    },
    {
      id: 'companyName',
      header: 'Empresa',
      cell: (row) => <div className="text-sm text-slate-600">{row.companyName || '—'}</div>,
    },
    {
      id: 'updatedAt',
      header: 'Atualizado em',
      cell: (row) => <div className="text-sm text-slate-500">{formatDateTime(row.updatedAt)}</div>,
    },
  ];

  return (
    <DataTable
      data={suppliers}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={createCrudListRowActions({
        basePath: '/company/suppliers',
        onDelete,
        getRowLabel,
        isDeleting,
      })}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum fornecedor encontrado.</div>}
    />
  );
}
