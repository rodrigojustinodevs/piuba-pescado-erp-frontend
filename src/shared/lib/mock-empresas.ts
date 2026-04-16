export interface CompanyAddress {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: CompanyAddress;
  active: boolean;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export const mockCompanies: Company[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'Aquacultura Piúba',
    cnpj: '12.345.678/0001-90',
    email: 'contato@piuba.com.br',
    phone: '(85) 99999-9999',
    address: {
      street: 'Rua das Tilápias',
      number: '100',
      complement: '',
      neighborhood: 'Centro',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60000-000',
    },
    active: true,
    status: 'active',
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2026-03-15T14:30:00.000Z',
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Fazenda Camarão Dourado',
    cnpj: '98.765.432/0001-10',
    email: 'admin@camaraodourado.com.br',
    phone: '(85) 98888-7777',
    address: {
      street: 'Av. do Pescado',
      number: '250',
      complement: 'Galpão 3',
      neighborhood: 'Industrial',
      city: 'Aracati',
      state: 'CE',
      zipCode: '62800-000',
    },
    active: true,
    status: 'active',
    createdAt: '2025-03-20T08:00:00.000Z',
    updatedAt: '2026-04-01T09:15:00.000Z',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    name: 'Piscicultura Nordeste',
    cnpj: '11.222.333/0001-44',
    email: 'contato@piscinordeste.com.br',
    phone: '(84) 97777-6666',
    address: {
      street: 'Rua dos Viveiros',
      number: '45',
      complement: '',
      neighborhood: 'Zona Rural',
      city: 'Mossoró',
      state: 'RN',
      zipCode: '59600-000',
    },
    active: false,
    status: 'inactive',
    createdAt: '2024-06-15T12:00:00.000Z',
    updatedAt: '2025-11-20T16:45:00.000Z',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    name: 'AquaFresh Ltda',
    cnpj: '55.666.777/0001-88',
    email: 'suporte@aquafresh.com.br',
    phone: '(81) 96666-5555',
    address: {
      street: 'Travessa do Mangue',
      number: '12',
      complement: 'Sala 2',
      neighborhood: 'Boa Viagem',
      city: 'Recife',
      state: 'PE',
      zipCode: '51000-000',
    },
    active: true,
    status: 'active',
    createdAt: '2025-08-01T07:30:00.000Z',
    updatedAt: '2026-04-10T11:00:00.000Z',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
    name: 'Fazenda Aquática Sul',
    cnpj: '33.444.555/0001-22',
    email: 'financeiro@aquaticasul.com.br',
    phone: '(48) 95555-4444',
    address: {
      street: 'Estrada do Camarão',
      number: '500',
      complement: '',
      neighborhood: 'Interior',
      city: 'Laguna',
      state: 'SC',
      zipCode: '88790-000',
    },
    active: false,
    status: 'suspended',
    createdAt: '2024-12-01T09:00:00.000Z',
    updatedAt: '2026-02-28T13:20:00.000Z',
  },
  {
    id: 'e5f6a7b8-c9d0-1234-efab-345678901234',
    name: 'Camarões do Maranhão',
    cnpj: '77.888.999/0001-55',
    email: 'vendas@camaroesma.com.br',
    phone: '(98) 94444-3333',
    address: {
      street: 'Rua do Porto',
      number: '88',
      complement: '',
      neighborhood: 'Centro',
      city: 'São Luís',
      state: 'MA',
      zipCode: '65000-000',
    },
    active: false,
    status: 'suspended',
    createdAt: '2025-05-10T14:00:00.000Z',
    updatedAt: '2026-04-12T08:45:00.000Z',
  },
];
