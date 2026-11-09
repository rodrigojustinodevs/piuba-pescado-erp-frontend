import type {
  CompanySettings,
  Currency,
  DateFormat,
  Locale,
  TemperatureUnit,
  VolumeUnit,
  WeightUnit,
} from '@/shared/types/companySettings';
import {
  TEMPERATURE_DIGITS,
  TEMPERATURE_SYMBOL,
  VOLUME_DIGITS,
  VOLUME_SYMBOL,
  WEIGHT_DIGITS,
  WEIGHT_SYMBOL,
  temperatureFromCelsius,
  volumeFromL,
  weightFromKg,
} from './units';

export const EMPTY_VALUE = '—';

/** Recorte das configurações usado pelos formatadores. */
export type FormatSettings = {
  locale: Locale;
  currency: Currency;
  /** `undefined` = fuso do navegador (só enquanto as configurações carregam). */
  timezone: string | undefined;
  dateFormat: DateFormat;
  weightUnit: WeightUnit;
  volumeUnit: VolumeUnit;
  temperatureUnit: TemperatureUnit;
};

/**
 * Usado apenas para renderizar antes de as configurações chegarem.
 * Espelha o comportamento anterior do app (pt-BR, R$, kg); nunca é enviado à API.
 */
export const FALLBACK_FORMAT_SETTINGS: FormatSettings = {
  locale: 'pt_BR',
  currency: 'BRL',
  timezone: undefined,
  dateFormat: 'd/m/Y',
  weightUnit: 'kg',
  volumeUnit: 'l',
  temperatureUnit: 'celsius',
};

export function toFormatSettings(settings: CompanySettings | undefined): FormatSettings {
  if (!settings) return FALLBACK_FORMAT_SETTINGS;
  return {
    // Idioma efetivo: preferência pessoal do usuário ou, se nula, o da empresa.
    locale: settings.appearance.effective.locale,
    currency: settings.general.currency,
    timezone: settings.general.timezone,
    dateFormat: settings.general.dateFormat,
    weightUnit: settings.units.weightUnit,
    volumeUnit: settings.units.volumeUnit,
    temperatureUnit: settings.units.temperatureUnit,
  };
}

export function toBcp47(locale: Locale): string {
  return locale.replace('_', '-');
}

type Nullable = number | null | undefined;

const numberFormatCache = new Map<string, Intl.NumberFormat>();
const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>();

function numberFormatter(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = numberFormatCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    numberFormatCache.set(key, formatter);
  }
  return formatter;
}

function dateTimeFormatter(timeZone: string | undefined): Intl.DateTimeFormat {
  const key = timeZone ?? 'local';
  let formatter = dateTimeFormatCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
    dateTimeFormatCache.set(key, formatter);
  }
  return formatter;
}

function isNil(value: Nullable): value is null | undefined {
  return value === null || value === undefined || Number.isNaN(value);
}

export function formatNumberWith(s: FormatSettings, value: Nullable, digits = 0): string {
  if (isNil(value)) return EMPTY_VALUE;
  return numberFormatter(toBcp47(s.locale), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatMoneyWith(s: FormatSettings, value: Nullable): string {
  if (isNil(value)) return EMPTY_VALUE;
  return numberFormatter(toBcp47(s.locale), { style: 'currency', currency: s.currency }).format(
    value,
  );
}

/** `kg` vindo da API → unidade de peso da empresa. */
export function formatWeightWith(s: FormatSettings, kg: Nullable, digits?: number): string {
  if (isNil(kg)) return EMPTY_VALUE;
  const value = weightFromKg(kg, s.weightUnit);
  return `${formatNumberWith(s, value, digits ?? WEIGHT_DIGITS[s.weightUnit])} ${WEIGHT_SYMBOL[s.weightUnit]}`;
}

/** `L` vindo da API → unidade de volume da empresa. */
export function formatVolumeWith(s: FormatSettings, liters: Nullable, digits?: number): string {
  if (isNil(liters)) return EMPTY_VALUE;
  const value = volumeFromL(liters, s.volumeUnit);
  return `${formatNumberWith(s, value, digits ?? VOLUME_DIGITS[s.volumeUnit])} ${VOLUME_SYMBOL[s.volumeUnit]}`;
}

/** `°C` vindo da API → unidade de temperatura da empresa. */
export function formatTemperatureWith(s: FormatSettings, celsius: Nullable): string {
  if (isNil(celsius)) return EMPTY_VALUE;
  const value = temperatureFromCelsius(celsius, s.temperatureUnit);
  return `${formatNumberWith(s, value, TEMPERATURE_DIGITS)} ${TEMPERATURE_SYMBOL[s.temperatureUnit]}`;
}

function arrangeDate(format: DateFormat, year: string, month: string, day: string): string {
  if (format === 'Y-m-d') return `${year}-${month}-${day}`;
  if (format === 'm/d/Y') return `${month}/${day}/${year}`;
  return `${day}/${month}/${year}`;
}

const PLAIN_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function zonedParts(s: FormatSettings, iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const parts: Record<string, string> = {};
  for (const part of dateTimeFormatter(s.timezone).formatToParts(date)) {
    parts[part.type] = part.value;
  }
  return parts;
}

/**
 * `YYYY-MM-DD` é uma data de calendário: só muda o formato, nunca o fuso.
 * Para ISO com hora, usa o dia no fuso da empresa.
 */
export function formatDateWith(s: FormatSettings, value: string | null | undefined): string {
  if (!value) return EMPTY_VALUE;
  const plain = PLAIN_DATE.exec(value);
  if (plain) return arrangeDate(s.dateFormat, plain[1], plain[2], plain[3]);
  const parts = zonedParts(s, value);
  if (!parts) return EMPTY_VALUE;
  return arrangeDate(s.dateFormat, parts.year, parts.month, parts.day);
}

/** Data e hora (ISO) exibida no fuso da empresa. */
export function formatDateTimeWith(s: FormatSettings, value: string | null | undefined): string {
  if (!value) return EMPTY_VALUE;
  const parts = zonedParts(s, value);
  if (!parts) return EMPTY_VALUE;
  return `${arrangeDate(s.dateFormat, parts.year, parts.month, parts.day)} ${parts.hour}:${parts.minute}`;
}
