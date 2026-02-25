import type { CreateCompanyData } from '../types';

type CompanyPayload = {
  name?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  addressStreet?: string;
  addressNumber?: string;
  addressComplement?: string;
  addressNeighborhood?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
};

function assignIfDefined<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K] | undefined,
): void {
  if (value !== undefined) {
    target[key] = value;
  }
}

export function mapCompanyPayload(data: Partial<CreateCompanyData>): CompanyPayload {
  const payload: CompanyPayload = {};

  assignIfDefined(payload, 'name', data.name);
  assignIfDefined(payload, 'cnpj', data.cnpj);
  assignIfDefined(payload, 'email', data.email);
  assignIfDefined(payload, 'phone', data.phone);
  assignIfDefined(payload, 'active', data.active);
  assignIfDefined(payload, 'addressStreet', data.address?.street);
  assignIfDefined(payload, 'addressNumber', data.address?.number);
  assignIfDefined(payload, 'addressComplement', data.address?.complement);
  assignIfDefined(payload, 'addressNeighborhood', data.address?.neighborhood);
  assignIfDefined(payload, 'addressCity', data.address?.city);
  assignIfDefined(payload, 'addressState', data.address?.state);
  assignIfDefined(payload, 'addressZipCode', data.address?.zipCode);

  return payload;
}
