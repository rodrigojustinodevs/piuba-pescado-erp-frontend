import type { GeneralFormValues, UnitsFormValues } from '../schemas';
import type { CompanySettings, GeneralPayload, UnitsPayload } from '../types';
import { maskCep, maskCnpj } from './document';

/** Valores normalizados da API → formulário (máscaras aplicadas, nulos como ''). */
export function toGeneralFormValues(general: CompanySettings['general']): GeneralFormValues {
  return {
    name: general.name,
    cnpj: maskCnpj(general.cnpj),
    email: general.email,
    phone: general.phone ?? '',
    address: {
      street: general.address.street,
      number: general.address.number,
      complement: general.address.complement ?? '',
      neighborhood: general.address.neighborhood,
      city: general.address.city,
      state: general.address.state,
      zipCode: maskCep(general.address.zipCode),
    },
    timezone: general.timezone,
    currency: general.currency,
    locale: general.locale,
    dateFormat: general.dateFormat,
  };
}

const orNull = (value: string) => (value.trim() === '' ? null : value.trim());

/** Seção completa: opcionais vão como `null`, nunca omitidos. */
export function toGeneralPayload(values: GeneralFormValues): GeneralPayload {
  return {
    name: values.name.trim(),
    cnpj: values.cnpj,
    email: values.email.trim(),
    phone: orNull(values.phone),
    address: {
      street: values.address.street.trim(),
      number: values.address.number.trim(),
      complement: orNull(values.address.complement),
      neighborhood: values.address.neighborhood.trim(),
      city: values.address.city.trim(),
      state: values.address.state,
      zipCode: values.address.zipCode,
    },
    timezone: values.timezone,
    currency: values.currency,
    locale: values.locale,
    dateFormat: values.dateFormat,
  };
}

export const toUnitsPayload = (values: UnitsFormValues): UnitsPayload => ({ ...values });
