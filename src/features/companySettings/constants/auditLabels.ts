import type { NotificationCategory } from '../types';
import {
  CURRENCY_OPTIONS,
  DATE_FORMAT_OPTIONS,
  ENTITY_LABELS,
  FREQUENCY_OPTIONS,
  LOCALE_OPTIONS,
  THEME_OPTIONS,
} from './options';

/** Rótulos das chaves internas (snake_case) que vêm em `changes`. */
const FIELD_LABELS: Record<string, string> = {
  name: 'Nome fantasia',
  cnpj: 'CNPJ',
  email: 'E-mail',
  phone: 'Telefone',
  address_street: 'Logradouro',
  address_number: 'Número',
  address_complement: 'Complemento',
  address_neighborhood: 'Bairro',
  address_city: 'Cidade',
  address_state: 'UF',
  address_zip_code: 'CEP',
  timezone: 'Fuso horário',
  currency: 'Moeda',
  locale: 'Idioma',
  date_format: 'Formato de data',
  weight_unit: 'Unidade de peso',
  volume_unit: 'Unidade de volume',
  temperature_unit: 'Unidade de temperatura',
  session_ttl_minutes: 'Expiração da sessão (min)',
  password_min_length: 'Tamanho mínimo da senha',
  password_require_uppercase: 'Exigir letra maiúscula',
  password_require_number: 'Exigir número',
  password_require_symbol: 'Exigir símbolo',
  theme: 'Tema',
  primary_color: 'Cor principal',
  export_id: 'Exportação',
  entities: 'Módulos exportados',
};

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  water_quality: 'Qualidade da água',
  temperature: 'Temperatura',
  dissolved_oxygen: 'Oxigênio dissolvido',
  ph: 'pH',
  ammonia: 'Amônia',
  low_feed_stock: 'Estoque baixo de ração',
  low_medicine_stock: 'Estoque baixo de medicamentos',
  high_mortality: 'Mortalidade elevada',
  biomass: 'Biomassa',
  feeding: 'Alimentação',
  operational: 'Operacional',
};

const NOTIFICATION_FIELD_LABELS: Record<string, string> = {
  enabled: 'ativo',
  frequency: 'frequência',
  channel_in_app: 'no sistema',
  channel_email: 'e-mail',
};

const VALUE_LABELS: Record<string, string> = {
  kg: 'kg',
  g: 'g',
  t: 't',
  l: 'L',
  m3: 'm³',
  ml: 'mL',
  celsius: '°C',
  fahrenheit: '°F',
  ...Object.fromEntries(
    [
      ...THEME_OPTIONS,
      ...FREQUENCY_OPTIONS,
      ...LOCALE_OPTIONS,
      ...DATE_FORMAT_OPTIONS,
      ...CURRENCY_OPTIONS,
    ].map((o) => [o.value, o.label]),
  ),
  ...ENTITY_LABELS,
};

/** Chave desconhecida volta crua: novas configurações podem surgir no backend. */
export function auditFieldLabel(key: string): string {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  const [category, field] = key.split('.');
  if (field && category in CATEGORY_LABELS) {
    const categoryLabel = CATEGORY_LABELS[category as NotificationCategory];
    return `${categoryLabel}: ${NOTIFICATION_FIELD_LABELS[field] ?? field}`;
  }
  return key;
}

export function auditValueLabel(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (Array.isArray(value)) {
    return value.length === 0 ? 'Todos' : value.map((item) => auditValueLabel(item)).join(', ');
  }
  if (typeof value === 'object') return JSON.stringify(value);
  const text = String(value);
  return VALUE_LABELS[text] ?? text;
}
