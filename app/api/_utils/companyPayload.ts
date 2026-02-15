import type { CreateCompanyData } from '@/features/company';

export function mapCompanyPayload(data: Partial<CreateCompanyData>) {
  const payload: Record<string, unknown> = {};

  if (data.name !== undefined) payload.name = data.name;
  if (data.cnpj !== undefined) payload.cnpj = data.cnpj;
  if (data.email !== undefined) payload.email = data.email;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.active !== undefined) payload.active = data.active;

  if (data.address) {
    if (data.address.street !== undefined) {
      payload.addressStreet = data.address.street;
    }
    if (data.address.number !== undefined) {
      payload.addressNumber = data.address.number;
    }
    if (data.address.complement !== undefined) {
      payload.addressComplement = data.address.complement;
    }
    if (data.address.neighborhood !== undefined) {
      payload.addressNeighborhood = data.address.neighborhood;
    }
    if (data.address.city !== undefined) {
      payload.addressCity = data.address.city;
    }
    if (data.address.state !== undefined) {
      payload.addressState = data.address.state;
    }
    if (data.address.zipCode !== undefined) {
      payload.addressZipCode = data.address.zipCode;
    }
  }

  return payload;
}
