'use client';

import type { Sensor } from '../types';
import { getSensorStatusLabel, getSensorTypeLabel } from '../utils/sensorDisplayLabels';
import {
  DataTable,
  EditIcon,
  EyeIcon,
  SpinnerIcon,
  TrashIcon,
  type DataTableColumn,
} from '@/shared/components/Table';

function formatDate(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return value;
  }
}

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
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

interface SensorTableProps {
  sensors: Sensor[];
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
}

function getRowLabel(row: Sensor): string {
  const type = getSensorTypeLabel(row.sensorType);
  return `${type === '—' ? row.sensorType || 'Sensor' : type} — ${row.tankName || 'Tanque'}`;
}

export function SensorTable({
  sensors,
  onDelete,
  isDeleting = false,
}: Readonly<SensorTableProps>) {
  const columns: Array<DataTableColumn<Sensor>> = [
    {
      id: 'sensorType',
      header: 'Tipo',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A]">{getSensorTypeLabel(row.sensorType)}</div>
      ),
    },
    {
      id: 'tankName',
      header: 'Tanque',
      cell: (row) => <div className="text-sm text-slate-600">{row.tankName || '—'}</div>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => <div className="text-sm text-slate-600">{getSensorStatusLabel(row.status)}</div>,
    },
    {
      id: 'installationDate',
      header: 'Instalação',
      cell: (row) => <div className="text-sm text-slate-600">{formatDate(row.installationDate)}</div>,
    },
    {
      id: 'updatedAt',
      header: 'Atualizado em',
      cell: (row) => <div className="text-sm text-slate-500">{formatDateTime(row.updatedAt)}</div>,
    },
  ];

  return (
    <DataTable
      data={sensors}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={(row) => {
        const actions = [
          {
            label: 'Ver detalhes',
            href: `/company/sensors/${row.id}`,
            icon: <EyeIcon className="h-4 w-4" />,
          },
          {
            label: 'Editar',
            href: `/company/sensors/${row.id}/edit`,
            icon: <EditIcon className="h-4 w-4" />,
          },
        ];
        if (!onDelete) return actions;
        return [
          ...actions,
          {
            label: 'Excluir',
            onClick: () => onDelete(row.id, getRowLabel(row)),
            variant: 'danger' as const,
            disabled: isDeleting,
            icon: isDeleting ? (
              <SpinnerIcon className="h-4 w-4 animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            ),
          },
        ];
      }}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum sensor encontrado.</div>}
    />
  );
}
