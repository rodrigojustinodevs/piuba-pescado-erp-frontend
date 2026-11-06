import type { BatchWarning, Harvest } from './types';

export const WARNING_LABELS: Record<BatchWarning, string> = {
  sem_povoamento: 'Sem povoamento registrado',
  populacao_inconsistente:
    'População negativa (mortes/transferências/despesca maiores que os povoados)',
  sem_biometria:
    'Sem biometria até a data de corte (peso, biomassa, FCA, GPD e densidade indisponíveis)',
  custo_racao_parcial: 'Há alimentações sem custo apurável (sem estoque vinculado)',
  venda_sem_despesca: 'Kg vendidos maiores que os kg despescados registrados',
  especie_nao_encontrada: 'Espécie não cadastrada (sem curva de crescimento e taxa máxima)',
};

export const CAUSE_LABELS: Record<string, string> = {
  disease: 'Doença',
  water_quality: 'Qualidade da água',
  predation: 'Predação',
  handling: 'Manejo',
  climate: 'Clima',
  unknown: 'Desconhecida',
  other: 'Outra',
};

export const SEVERITY_LABELS: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
  unspecified: 'Não informada',
};

export const HARVEST_TYPE_LABELS: Record<Harvest['type'], string> = {
  total: 'Total',
  partial: 'Parcial',
  selective: 'Seletiva',
  emergency: 'Emergência',
};

export const HARVEST_DESTINATION_LABELS: Record<NonNullable<Harvest['destination']>, string> = {
  wholesale: 'Atacado',
  retail: 'Varejo',
  processing: 'Processamento',
  restaurant: 'Restaurante',
  live_market: 'Peixe vivo',
  internal: 'Interno',
};

export const STATUS_FILTER_LABELS = {
  all: 'Todos',
  active: 'Ativos',
  finished: 'Finalizados',
} as const;

/** Desvio de crescimento abaixo deste valor é destacado (mesmo critério do PDF). */
export const GROWTH_DEVIATION_ALERT_PCT = -10;

/** Polling: começa em 2s e sobe até 5s; desiste após 30 min. */
export const EXPORT_POLL_MIN_MS = 2000;
export const EXPORT_POLL_MAX_MS = 5000;
export const EXPORT_POLL_TIMEOUT_MS = 30 * 60 * 1000;

export const EXPORT_STORAGE_KEY = 'production-report:export';
