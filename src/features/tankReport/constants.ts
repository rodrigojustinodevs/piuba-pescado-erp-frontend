import type { OccupancyFilter, TankStatusFilter, TankWarning } from './types';

export const TANK_EXPORT_STORAGE_KEY = 'tank-report:export';

export const STATUS_LABELS: Record<TankStatusFilter, string> = {
  all: 'Todos',
  active: 'Ativos',
  inactive: 'Inativos',
};

export const OCCUPANCY_LABELS: Record<OccupancyFilter, string> = {
  all: 'Todos',
  occupied: 'Ocupados',
  idle: 'Ociosos',
};

export const WARNING_LABELS: Record<TankWarning, string> = {
  sem_biometria: 'Lote sem biometria: biomassa e densidade indisponíveis',
  capacidade_invalida: 'Capacidade do tanque inválida (≤ 0): densidade indisponível',
  varios_lotes: 'Mais de um lote ativo no mesmo tanque (o sistema permite apenas um por tanque)',
  inativo_com_lote: 'Tanque inativo com lote ativo',
  populacao_inconsistente:
    'População negativa em algum lote (mortes/transferências/despesca maiores que os povoados)',
};
