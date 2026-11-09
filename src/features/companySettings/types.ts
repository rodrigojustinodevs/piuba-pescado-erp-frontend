import type {
  Address,
  CompanySettings,
  Currency,
  DateFormat,
  Locale,
  TemperatureUnit,
  Theme,
  VolumeUnit,
  WeightUnit,
} from '@/shared/types/companySettings';

export type {
  Address,
  CompanySettings,
  Currency,
  DateFormat,
  Locale,
  TemperatureUnit,
  Theme,
  VolumeUnit,
  WeightUnit,
};

export type NotificationCategory =
  | 'water_quality'
  | 'temperature'
  | 'dissolved_oxygen'
  | 'ph'
  | 'ammonia'
  | 'low_feed_stock'
  | 'low_medicine_stock'
  | 'high_mortality'
  | 'biomass'
  | 'feeding'
  | 'operational';

export type NotificationFrequency = 'immediate' | 'daily_digest';

export type NotificationPreference = {
  category: NotificationCategory;
  /** Texto pt-BR pronto (só na resposta). */
  label: string;
  enabled: boolean;
  channels: { inApp: boolean; email: boolean };
  frequency: NotificationFrequency;
};

export type SecuritySettings = {
  sessionTtlMinutes: number | null;
  effectiveSessionTtlMinutes: number;
  sessionTtlLimits: { min: number; max: number; default: number };
  refreshTtlMinutes: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumber: boolean;
    requireSymbol: boolean;
    limits: { min: number; max: number };
  };
};

export type ExportableEntity =
  | 'tanks'
  | 'batches'
  | 'stockings'
  | 'biometries'
  | 'feedings'
  | 'mortalities'
  | 'water_qualities'
  | 'harvests'
  | 'stocks'
  | 'stock_transactions'
  | 'supplies'
  | 'purchases'
  | 'suppliers'
  | 'clients'
  | 'sales'
  | 'financial_transactions';

export type RecentExport = {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  rows: number | null;
  durationMs: number | null;
  createdAt: string;
};

export type DataOverview = {
  records: Partial<Record<ExportableEntity, number>>;
  totalRecords: number;
  storage: { storedExportsBytes: number };
  recentExports: RecentExport[];
  capabilities: { dataExport: boolean; backupRequest: boolean; retentionPolicy: boolean };
};

export type SettingsSection =
  | 'general'
  | 'units'
  | 'notifications'
  | 'security'
  | 'appearance'
  | 'user_appearance'
  | 'data_export';

export type SettingChange = {
  id: string;
  section: SettingsSection;
  changes: Record<string, { old: unknown; new: unknown }>;
  user: { id: string; name: string; email: string } | null;
  ip: string | null;
  createdAt: string;
};

export type AuditLogPage = {
  items: SettingChange[];
  total: number;
  page: number;
  lastPage: number;
  perPage: number;
};

/* ---------- Payloads (PUT substitui a seção inteira) ---------- */

export type GeneralPayload = {
  name: string;
  cnpj: string;
  email: string;
  phone: string | null;
  address: Address;
  timezone: string;
  currency: Currency;
  locale: Locale;
  dateFormat: DateFormat;
};

export type UnitsPayload = {
  weightUnit: WeightUnit;
  volumeUnit: VolumeUnit;
  temperatureUnit: TemperatureUnit;
};

export type NotificationsPayload = {
  preferences: Array<Omit<NotificationPreference, 'label'>>;
};

export type SecurityPayload = {
  sessionTtlMinutes: number | null;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumber: boolean;
    requireSymbol: boolean;
  };
};

export type CompanyAppearancePayload = { theme: Theme; primaryColor: string | null };
export type UserAppearancePayload = { theme: Theme | null; locale: Locale | null };

export type StartDataExportResult = { id: string; status: 'pending' };
