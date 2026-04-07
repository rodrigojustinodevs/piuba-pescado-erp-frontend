import type { Tank } from '../types';

/**
 * Formata capacidade em litros com locale pt-BR.
 */
export function formatCapacityLiters(capacity?: Tank['capacityLiters']) {
  if (!capacity && capacity !== 0) return '-';

  return (
    capacity.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' L'
  );
}
