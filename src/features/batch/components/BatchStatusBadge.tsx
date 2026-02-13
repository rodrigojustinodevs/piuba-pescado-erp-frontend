"use client";

import type { BatchStatus } from "../types";

const statusConfig: Record<
  BatchStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Ativo",
    className: "bg-green-100 text-green-800",
  },
  finished: {
    label: "Finalizado",
    className: "bg-slate-100 text-slate-800",
  },
  canceled: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800",
  },
};

export interface BatchStatusBadgeProps {
  status: BatchStatus;
}

export function BatchStatusBadge({ status }: BatchStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
}
