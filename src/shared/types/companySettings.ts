/** Tipos das configurações da empresa (`GET /api/company/settings`). */

export type Currency = 'BRL' | 'USD' | 'EUR';
export type Locale = 'pt_BR' | 'en_US' | 'es_ES';
/** Formato PHP: dd/MM/yyyy, yyyy-MM-dd, MM/dd/yyyy. */
export type DateFormat = 'd/m/Y' | 'Y-m-d' | 'm/d/Y';
export type WeightUnit = 'kg' | 'g' | 't';
export type VolumeUnit = 'l' | 'm3' | 'ml';
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type Theme = 'light' | 'dark' | 'system';

export type Address = {
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  /** Na resposta vem só com dígitos. */
  zipCode: string;
};

export type CompanySettings = {
  companyId: string;
  general: {
    name: string;
    /** Só dígitos. */
    cnpj: string;
    cnpjFormatted: string | null;
    email: string;
    phone: string | null;
    address: Address;
    timezone: string;
    currency: Currency;
    currencySymbol: string;
    locale: Locale;
    dateFormat: DateFormat;
  };
  units: {
    weightUnit: WeightUnit;
    weightSymbol: string;
    volumeUnit: VolumeUnit;
    volumeSymbol: string;
    temperatureUnit: TemperatureUnit;
    temperatureSymbol: string;
    storageUnits: { weight: 'kg'; volume: 'l'; temperature: 'celsius' };
  };
  appearance: {
    company: { theme: Theme; primaryColor: string | null };
    user: { theme: Theme | null; locale: Locale | null };
    effective: { theme: Theme; locale: Locale };
  };
  updatedAt: string | null;
};
