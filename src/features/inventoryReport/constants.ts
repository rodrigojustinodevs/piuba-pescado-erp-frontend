import type { Category, SituationFilter, StockType, StockWarning } from './types';

export const INVENTORY_EXPORT_STORAGE_KEY = 'inventory-report:export';

export const SITUATION_LABELS: Record<SituationFilter, string> = {
  all: 'Todas',
  ok: 'Normal',
  below_minimum: 'Abaixo do mínimo',
  zero: 'Zerado',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  feed: 'Ração',
  medication: 'Medicamento',
  fertilizer: 'Fertilizante',
  probiotic: 'Probiótico',
  equipment: 'Equipamento',
  packaging: 'Embalagem',
  finished_product: 'Produto acabado',
  other: 'Outro',
};

export const STOCK_TYPE_LABELS: Record<StockType, string> = {
  warehouse: 'Armazém',
  cold_room: 'Câmara fria',
  silo: 'Silo',
  storage: 'Depósito',
  field: 'Campo',
};

export const WARNING_LABELS: Record<StockWarning, string> = {
  saldo_negativo: 'Saldo negativo (saídas maiores que as entradas registradas)',
  sem_preco: 'Sem preço unitário: o valor em estoque está subestimado',
  unidade_divergente:
    'Unidade das movimentações diferente da do estoque: consumo e cobertura indisponíveis',
};

export const UNIT_LABELS: Record<string, string> = { thousand: 'mil' };

/** Regra de tela (o backend não classifica): cobertura em dias. */
export const COVERAGE_DANGER_DAYS = 7;
export const COVERAGE_WARNING_DAYS = 15;

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));
export const STOCK_TYPE_OPTIONS = Object.entries(STOCK_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));
