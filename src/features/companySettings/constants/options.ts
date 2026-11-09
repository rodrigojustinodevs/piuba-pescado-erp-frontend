import type {
  Currency,
  DateFormat,
  ExportableEntity,
  Locale,
  NotificationFrequency,
  SettingsSection,
  TemperatureUnit,
  Theme,
  VolumeUnit,
  WeightUnit,
} from '../types';

type Option<T extends string> = { value: T; label: string };

export const CURRENCY_OPTIONS: Option<Currency>[] = [
  { value: 'BRL', label: 'Real (R$)' },
  { value: 'USD', label: 'Dólar americano (US$)' },
  { value: 'EUR', label: 'Euro (€)' },
];

export const LOCALE_OPTIONS: Option<Locale>[] = [
  { value: 'pt_BR', label: 'Português (Brasil)' },
  { value: 'en_US', label: 'English (US)' },
  { value: 'es_ES', label: 'Español' },
];

export const DATE_FORMAT_OPTIONS: Option<DateFormat>[] = [
  { value: 'd/m/Y', label: 'DD/MM/AAAA' },
  { value: 'Y-m-d', label: 'AAAA-MM-DD' },
  { value: 'm/d/Y', label: 'MM/DD/AAAA' },
];

export const WEIGHT_OPTIONS: Option<WeightUnit>[] = [
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'g', label: 'Gramas (g)' },
  { value: 't', label: 'Toneladas (t)' },
];

export const VOLUME_OPTIONS: Option<VolumeUnit>[] = [
  { value: 'l', label: 'Litros (L)' },
  { value: 'm3', label: 'Metros cúbicos (m³)' },
  { value: 'ml', label: 'Mililitros (mL)' },
];

export const TEMPERATURE_OPTIONS: Option<TemperatureUnit>[] = [
  { value: 'celsius', label: 'Celsius (°C)' },
  { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
];

export const THEME_OPTIONS: Option<Theme>[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'system', label: 'Sistema' },
];

export const FREQUENCY_OPTIONS: Option<NotificationFrequency>[] = [
  { value: 'immediate', label: 'Imediata' },
  { value: 'daily_digest', label: 'Resumo diário' },
];

export const UF_OPTIONS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;

/** Fusos do Brasil no topo do select. */
export const BRAZIL_TIMEZONES: Option<string>[] = [
  { value: 'America/Fortaleza', label: 'Fortaleza (GMT-3)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo / Brasília (GMT-3)' },
  { value: 'America/Recife', label: 'Recife (GMT-3)' },
  { value: 'America/Bahia', label: 'Salvador (GMT-3)' },
  { value: 'America/Belem', label: 'Belém (GMT-3)' },
  { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
  { value: 'America/Cuiaba', label: 'Cuiabá (GMT-4)' },
  { value: 'America/Porto_Velho', label: 'Porto Velho (GMT-4)' },
  { value: 'America/Boa_Vista', label: 'Boa Vista (GMT-4)' },
  { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' },
  { value: 'America/Noronha', label: 'Fernando de Noronha (GMT-2)' },
];

export const ENTITY_LABELS: Record<ExportableEntity, string> = {
  tanks: 'Tanques',
  batches: 'Lotes',
  stockings: 'Povoamentos',
  biometries: 'Biometrias',
  feedings: 'Arraçoamentos',
  mortalities: 'Mortalidades',
  water_qualities: 'Qualidade da água',
  harvests: 'Despescas',
  stocks: 'Estoques',
  stock_transactions: 'Movimentações de estoque',
  supplies: 'Insumos',
  purchases: 'Compras',
  suppliers: 'Fornecedores',
  clients: 'Clientes',
  sales: 'Vendas',
  financial_transactions: 'Lançamentos financeiros',
};

export const EXPORTABLE_ENTITIES = Object.keys(ENTITY_LABELS) as ExportableEntity[];

export const SECTION_LABELS: Record<SettingsSection, string> = {
  general: 'Geral',
  units: 'Unidades',
  notifications: 'Notificações',
  security: 'Segurança',
  appearance: 'Aparência (empresa)',
  user_appearance: 'Aparência (pessoal)',
  data_export: 'Exportação de dados',
};

export const EXPORT_TYPE_LABELS: Record<string, string> = {
  'data-export': 'Exportação de dados',
  production: 'Relatório de produção',
  commercial: 'Relatório comercial',
  financial: 'Relatório financeiro',
  inventory: 'Relatório de estoque',
  tank: 'Relatório de viveiros',
};
