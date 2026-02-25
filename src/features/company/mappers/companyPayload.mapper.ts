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

export function mapCompanyPayload(data: Partial<CreateCompanyData>): CompanyPayload {
  const payload: CompanyPayload = {};

  if (data.name !== undefined) payload.name = data.name;
  if (data.cnpj !== undefined) payload.cnpj = data.cnpj;
  if (data.email !== undefined) payload.email = data.email;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.active !== undefined) payload.active = data.active;

  if (data.address) {
    const { street, number, complement, neighborhood, city, state, zipCode } = data.address;

    if (street !== undefined) payload.addressStreet = street;
    if (number !== undefined) payload.addressNumber = number;
    if (complement !== undefined) payload.addressComplement = complement;
    if (neighborhood !== undefined) payload.addressNeighborhood = neighborhood;
    if (city !== undefined) payload.addressCity = city;
    if (state !== undefined) payload.addressState = state;
    if (zipCode !== undefined) payload.addressZipCode = zipCode;
  }

  return payload;
}
