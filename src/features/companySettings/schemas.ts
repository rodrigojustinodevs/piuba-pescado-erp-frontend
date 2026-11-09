import { z } from 'zod';
import { isValidCnpj } from './utils/document';

const required = (label: string) => z.string().trim().min(1, `Informe ${label}.`);

export const generalSchema = z.object({
  name: required('o nome fantasia').max(255, 'Use no máximo 255 caracteres.'),
  cnpj: z.string().refine(isValidCnpj, 'CNPJ inválido.'),
  email: z.email('E-mail inválido.'),
  phone: z.string().max(20, 'Use no máximo 20 caracteres.'),
  address: z.object({
    street: required('o logradouro'),
    number: required('o número'),
    complement: z.string(),
    neighborhood: required('o bairro'),
    city: required('a cidade'),
    state: z.string().regex(/^[A-Z]{2}$/, 'Selecione a UF.'),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido (00000-000).'),
  }),
  timezone: required('o fuso horário'),
  currency: z.enum(['BRL', 'USD', 'EUR']),
  locale: z.enum(['pt_BR', 'en_US', 'es_ES']),
  dateFormat: z.enum(['d/m/Y', 'Y-m-d', 'm/d/Y']),
});

export type GeneralFormValues = z.infer<typeof generalSchema>;

export const unitsSchema = z.object({
  weightUnit: z.enum(['kg', 'g', 't']),
  volumeUnit: z.enum(['l', 'm3', 'ml']),
  temperatureUnit: z.enum(['celsius', 'fahrenheit']),
});

export type UnitsFormValues = z.infer<typeof unitsSchema>;

export const HEX_COLOR = /^#[0-9A-F]{6}$/i;
