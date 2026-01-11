import type { Tank } from "../types";

/**
 * Formata capacidade em litros com locale pt-BR.
 */
export function formatCapacityLiters(capacity?: Tank["capacityLiters"]) {
  if (!capacity && capacity !== 0) return "-";

  return (
    capacity.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " L"
  );
}

/**
 * Retorna classes utilitárias para badge de status.
 */
export function getStatusBadgeClass(status: Tank["status"]) {
  return status === "active"
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
}

