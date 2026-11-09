import type { TemperatureUnit, VolumeUnit, WeightUnit } from '@/shared/types/companySettings';

/**
 * Conversões de apresentação. A API sempre trafega kg, L e °C:
 * converta só para exibir e converta de volta antes de enviar.
 */

const WEIGHT_FROM_KG: Record<WeightUnit, number> = { kg: 1, g: 1000, t: 0.001 };
const VOLUME_FROM_L: Record<VolumeUnit, number> = { l: 1, m3: 0.001, ml: 1000 };

export const WEIGHT_DIGITS: Record<WeightUnit, number> = { kg: 1, g: 0, t: 3 };
export const VOLUME_DIGITS: Record<VolumeUnit, number> = { l: 1, m3: 3, ml: 0 };
export const TEMPERATURE_DIGITS = 1;

export const WEIGHT_SYMBOL: Record<WeightUnit, string> = { kg: 'kg', g: 'g', t: 't' };
export const VOLUME_SYMBOL: Record<VolumeUnit, string> = { l: 'L', m3: 'm³', ml: 'mL' };
export const TEMPERATURE_SYMBOL: Record<TemperatureUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
};

export function weightFromKg(kg: number, unit: WeightUnit): number {
  return kg * WEIGHT_FROM_KG[unit];
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return value / WEIGHT_FROM_KG[unit];
}

export function volumeFromL(liters: number, unit: VolumeUnit): number {
  return liters * VOLUME_FROM_L[unit];
}

export function volumeToL(value: number, unit: VolumeUnit): number {
  return value / VOLUME_FROM_L[unit];
}

export function temperatureFromCelsius(celsius: number, unit: TemperatureUnit): number {
  return unit === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius;
}

export function temperatureToCelsius(value: number, unit: TemperatureUnit): number {
  return unit === 'fahrenheit' ? ((value - 32) * 5) / 9 : value;
}
