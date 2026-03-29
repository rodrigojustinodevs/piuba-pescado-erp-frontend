'use client';

import type { WaterQuality } from '../types';
import { DataTable, createCrudListRowActions, type DataTableColumn } from '@/shared/components/Table';

function getRowLabel(row: WaterQuality): string {
  return `${row.tankName || 'Tanque'} · pH ${row.ph}`;
}

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

interface WaterQualityTableProps {
  waterQualities: WaterQuality[];
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
}

export function WaterQualityTable({
  waterQualities,
  onDelete,
  isDeleting = false,
}: Readonly<WaterQualityTableProps>) {
  const columns: Array<DataTableColumn<WaterQuality>> = [
    {
      id: 'measuredAt',
      header: 'Medição',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A]">{formatDateTime(row.measuredAt)}</div>
      ),
    },
    {
      id: 'tankName',
      header: 'Tanque',
      cell: (row) => <div className="text-sm text-slate-600">{row.tankName || '—'}</div>,
    },
    {
      id: 'ph',
      header: 'pH',
      cell: (row) => <div className="text-sm text-slate-600 tabular-nums">{row.ph}</div>,
    },
    {
      id: 'dissolvedOxygen',
      header: 'O₂ dissolvido',
      cell: (row) => (
        <div className="text-sm text-slate-600 tabular-nums">{row.dissolvedOxygen}</div>
      ),
    },
    {
      id: 'temperature',
      header: 'Temperatura (°C)',
      cell: (row) => (
        <div className="text-sm text-slate-600 tabular-nums">{row.temperature}</div>
      ),
    },
    {
      id: 'ammonia',
      header: 'Amônia',
      cell: (row) => <div className="text-sm text-slate-600 tabular-nums">{row.ammonia}</div>,
    },
    {
      id: 'salinity',
      header: 'Salinidade',
      cell: (row) => (
        <div className="text-sm text-slate-600 tabular-nums">{row.salinity || '—'}</div>
      ),
    },
    {
      id: 'turbidity',
      header: 'Turbidez',
      cell: (row) => (
        <div className="text-sm text-slate-600 tabular-nums">{row.turbidity || '—'}</div>
      ),
    },
    {
      id: 'notes',
      header: 'Observações',
      cell: (row) => (
        <div className="text-sm text-slate-500 max-w-[160px] truncate" title={row.notes ?? ''}>
          {row.notes || '—'}
        </div>
      ),
    },
    {
      id: 'updatedAt',
      header: 'Atualizado em',
      cell: (row) => (
        <div className="text-sm text-slate-500">{formatDateTime(row.updatedAt)}</div>
      ),
    },
  ];

  return (
    <DataTable
      data={waterQualities}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={createCrudListRowActions({
        basePath: '/company/water-qualities',
        onDelete,
        getRowLabel,
        isDeleting,
      })}
      emptyState={
        <div className="p-8 text-center text-slate-500">Nenhum registro encontrado.</div>
      }
    />
  );
}
