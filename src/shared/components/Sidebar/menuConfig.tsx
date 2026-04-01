'use client';

import type { MenuItem } from './types';
import { UserRole, type UserRoleType } from '@/shared/types/auth';
import {
  BatchIcon,
  BiometryIcon,
  BuildingIcon,
  DashboardIcon,
  FeedingIcon,
  OrdersIcon,
  ProductsIcon,
  ReportsIcon,
  StockingIcon,
  TransferIcon,
  SettingsIcon,
  TankIcon,
} from './menuIcons';

export interface MenuItemWithAuth extends Omit<MenuItem, 'children'> {
  allowedRoles?: UserRoleType[];
  requiresCompany?: boolean;
  children?: MenuItemWithAuth[];
}

const ROLES_ALL: UserRoleType[] = [
  UserRole.MASTER,
  UserRole.COMPANY_ADMIN,
  UserRole.MANAGER,
  UserRole.OPERATOR,
];
const ROLES_COMPANY_ALL: UserRoleType[] = [
  UserRole.COMPANY_ADMIN,
  UserRole.MANAGER,
  UserRole.OPERATOR,
];
const ROLES_COMPANY_ADMIN_MANAGER: UserRoleType[] = [UserRole.COMPANY_ADMIN, UserRole.MANAGER];
const REQUIRES_COMPANY = true;

export const menuConfig: MenuItemWithAuth[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    href: '/dashboard',
    allowedRoles: ROLES_ALL,
  },
  {
    id: 'empresas',
    label: 'Empresas',
    icon: <BuildingIcon />,
    href: '/admin/companies',
    allowedRoles: [UserRole.MASTER],
  },
  {
    id: 'vendas',
    label: 'Vendas',
    icon: <OrdersIcon />,
    allowedRoles: ROLES_COMPANY_ALL,
    requiresCompany: REQUIRES_COMPANY,
    children: [
      {
        id: 'pedidos',
        label: 'Pedidos',
        href: '/dashboard/pedidos',
        allowedRoles: ROLES_COMPANY_ALL,
      },
      {
        id: 'orcamentos',
        label: 'Orçamentos',
        href: '/dashboard/orcamentos',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'clientes',
        label: 'Clientes',
        href: '/company/clients',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
    ],
  },
  {
    id: 'estoque',
    label: 'Estoque',
    icon: <ProductsIcon />,
    allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
    requiresCompany: REQUIRES_COMPANY,
    children: [
      {
        id: 'produtos-insumos',
        label: 'Produtos',
        href: '/company/supplies',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'compras',
        label: 'Compras',
        href: '/company/purchases',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'fornecedores',
        label: 'Fornecedores',
        href: '/company/suppliers',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'estoques',
        label: 'Estoques',
        href: '/company/stocks',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'estoques-transacoes',
        label: 'Movimentações de estoque',
        href: '/company/stocks-transations',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
    ],
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: <ReportsIcon />,
    allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
    requiresCompany: REQUIRES_COMPANY,
    children: [
      {
        id: 'vendas',
        label: 'Relatório de Vendas',
        href: '/dashboard/relatorios/vendas',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'estoque',
        label: 'Relatório de Estoque',
        href: '/dashboard/relatorios/estoque',
        allowedRoles: [UserRole.COMPANY_ADMIN],
      },
    ],
  },
  {
    id: 'tanques',
    label: 'Tanques',
    icon: <TankIcon />,
    href: '/company/tanks',
    allowedRoles: ROLES_COMPANY_ALL,
    requiresCompany: REQUIRES_COMPANY,
    children: [
      {
        id: 'tanques',
        label: 'Tanques',
        href: '/company/tanks',
      },
      {
        id: 'sensores',
        label: 'Sensores',
        href: '/company/sensors',
      },
      {
        id: 'leituras-sensores',
        label: 'Leituras',
        href: '/company/sensor-readings',
      },
      {
        id: 'qualidade-agua',
        label: 'Qualidade da água',
        href: '/company/water-qualities',
      },
    ],
  },
  {
    id: 'lotes',
    label: 'Lotes',
    icon: <BatchIcon />,
    allowedRoles: ROLES_COMPANY_ALL,
    requiresCompany: REQUIRES_COMPANY,
    children: [
      {
        id: 'lotes',
        label: 'Lotes',
        href: '/company/batches',
        allowedRoles: ROLES_COMPANY_ALL,
      },
      {
        id: 'mortalidades',
        label: 'Mortalidades',
        href: '/company/mortalities',
        allowedRoles: ROLES_COMPANY_ALL,
      },
    ],
  },
  {
    id: 'biometrias',
    label: 'Biometrias',
    icon: <BiometryIcon />,
    href: '/company/biometries',
    allowedRoles: ROLES_COMPANY_ALL,
    requiresCompany: REQUIRES_COMPANY,
  },
  {
    id: 'alimentacoes',
    label: 'Alimentações',
    icon: <FeedingIcon />,
    href: '/company/feedings',
    allowedRoles: ROLES_COMPANY_ALL,
    requiresCompany: REQUIRES_COMPANY,
  },
  {
    id: 'povoamentos',
    label: 'Povoamentos',
    icon: <StockingIcon />,
    href: '/company/stockings',
    allowedRoles: ROLES_COMPANY_ALL,
    requiresCompany: REQUIRES_COMPANY,
  },
  {
    id: 'transferencias',
    label: 'Transferências',
    icon: <TransferIcon />,
    href: '/company/transfers',
    allowedRoles: ROLES_COMPANY_ALL,
    requiresCompany: REQUIRES_COMPANY,
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: <SettingsIcon />,
    href: '/dashboard/configuracoes',
    allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
    requiresCompany: REQUIRES_COMPANY,
  },
];
