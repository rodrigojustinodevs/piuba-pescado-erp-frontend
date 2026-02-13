"use client";

import type { Batch } from "../types";
import { DataTable, type DataTableColumn } from "@/shared/components/Table";
import { BatchStatusBadge } from "./BatchStatusBadge";
import { formatDate, formatQuantity, getCultivationLabel } from "../utils/format";

export interface BatchTableProps {
  batches: Batch[];
  onDelete: (id: string, species: string) => void;
  isDeleting?: boolean;
}

export function BatchTable({
  batches,
  onDelete,
  isDeleting = false,
}: BatchTableProps) {
  const columns: Array<DataTableColumn<Batch>> = [
    {
      id: "lote",
      header: "Lote",
      cell: (batch) => (
        <div className="text-sm font-medium text-[#0F172A]">
          {batch.id.slice(0, 8)}…
        </div>
      ),
    },
    {
      id: "species",
      header: "Espécie",
      cell: (batch) => (
        <div className="text-sm text-slate-600">{batch.species}</div>
      ),
    },
    {
      id: "tank",
      header: "Tanque",
      cell: (batch) => (
        <div className="text-sm text-slate-600">{batch.tank?.name ?? "—"}</div>
      ),
    },
    {
      id: "initialQuantity",
      header: "Quantidade Inicial",
      cell: (batch) => (
        <div className="text-sm text-slate-600">
          {formatQuantity(batch.initialQuantity)}
        </div>
      ),
    },
    {
      id: "cultivation",
      header: "Cultivo",
      cell: (batch) => (
        <div className="text-sm text-slate-600">
          {getCultivationLabel(batch.cultivation)}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (batch) => <BatchStatusBadge status={batch.status} />,
    },
    {
      id: "entryDate",
      header: "Entrada",
      cell: (batch) => (
        <div className="text-sm text-slate-600">
          {formatDate(batch.entryDate)}
        </div>
      ),
    },
  ];

  if (batches.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        Nenhum lote encontrado.
      </div>
    );
  }

  return (
    <DataTable
      data={batches}
      columns={columns}
      getRowId={(batch) => batch.id}
      rowActions={(batch) => [
        {
          label: "Ver detalhes",
          href: `/company/batches/${batch.id}`,
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ),
        },
        {
          label: "Editar",
          href: `/company/batches/${batch.id}/edit`,
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          ),
        },
        {
          label: "Excluir",
          onClick: () => onDelete(batch.id, batch.species),
          variant: "danger",
          disabled: isDeleting,
          icon: isDeleting ? (
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          ),
        },
      ]}
    />
  );
}
