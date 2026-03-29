/** Valores vindos da API → rótulos em português para exibição */

export const SENSOR_TYPE_LABELS: Record<string, string> = {
  ph: 'pH',
  temperature: 'Temperatura',
  oxygen: 'Oxigênio',
  ammonia: 'Amônia',
};

export const SENSOR_STATUS_LABELS: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  maintenance: 'Manutenção',
};

export function getSensorTypeLabel(value: string | null | undefined): string {
  if (!value) return '—';
  return SENSOR_TYPE_LABELS[value] ?? value;
}

export function getSensorStatusLabel(value: string | null | undefined): string {
  if (!value) return '—';
  return SENSOR_STATUS_LABELS[value] ?? value;
}

export const SENSOR_TYPE_OPTIONS = Object.entries(SENSOR_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const SENSOR_STATUS_OPTIONS = Object.entries(SENSOR_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
