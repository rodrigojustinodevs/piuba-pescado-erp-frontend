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

export const menuConfig: MenuItemWithAuth[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    href: '/dashboard',
    allowedRoles: [UserRole.MASTER, UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
  },
  {
    id: 'vendas',
    label: 'Vendas',
    icon: <OrdersIcon />,
    allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
    requiresCompany: true,
    children: [
      {
        id: 'pedidos',
        label: 'Pedidos',
        href: '/dashboard/pedidos',
        allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
      },
      {
        id: 'orcamentos',
        label: 'Orçamentos',
        href: '/dashboard/orcamentos',
        allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER],
      },
      {
        id: 'clientes',
        label: 'Clientes',
        href: '/dashboard/clientes',
        allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER],
      },
    ],
  },
  {
    id: 'estoque',
    label: 'Estoque',
    icon: <ProductsIcon />,
    allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER],
    requiresCompany: true,
    children: [
      {
        id: 'produtos',
        label: 'Produtos',
        href: '/dashboard/produtos',
        allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER],
      },
      {
        id: 'categorias',
        label: 'Categorias',
        href: '/dashboard/categorias',
        allowedRoles: [UserRole.COMPANY_ADMIN],
      },
      {
        id: 'movimentacoes',
        label: 'Movimentações',
        href: '/dashboard/movimentacoes',
        allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER],
      },
      {
        id: 'compras',
        label: 'Compras',
        href: '/company/purchases',
        allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER],
      },
      {
        id: 'fornecedores',
        label: 'Fornecedores',
        href: '/company/suppliers',
        allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER],
      },
    ],
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: <ReportsIcon />,
    allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER],
    requiresCompany: true,
    children: [
      {
        id: 'vendas',
        label: 'Relatório de Vendas',
        href: '/dashboard/relatorios/vendas',
        allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER],
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
    id: 'empresas',
    label: 'Empresas',
    icon: <BuildingIcon />,
    href: '/admin/companies',
    allowedRoles: [UserRole.MASTER],
  },
  {
    id: 'tanques',
    label: 'Tanques',
    icon: <TankIcon />,
    href: '/company/tanks',
    allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
    requiresCompany: true,
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
    allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
    requiresCompany: true,
    children: [
      {
        id: 'lotes',
        label: 'Lotes',
        href: '/company/batches',
        allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
      },
      {
        id: 'mortalidades',
        label: 'Mortalidades',
        href: '/company/mortalities',
        allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
      },
    ],
  },
  {
    id: 'biometrias',
    label: 'Biometrias',
    icon: <BiometryIcon />,
    href: '/company/biometries',
    allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
    requiresCompany: true,
  },
  {
    id: 'alimentacoes',
    label: 'Alimentações',
    icon: <FeedingIcon />,
    href: '/company/feedings',
    allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
    requiresCompany: true,
  },
  {
    id: 'povoamentos',
    label: 'Povoamentos',
    icon: <StockingIcon />,
    href: '/company/stockings',
    allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
    requiresCompany: true,
  },
  {
    id: 'transferencias',
    label: 'Transferências',
    icon: <TransferIcon />,
    href: '/company/transfers',
    allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
    requiresCompany: true,
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: <SettingsIcon />,
    href: '/dashboard/configuracoes',
    allowedRoles: [UserRole.COMPANY_ADMIN, UserRole.MANAGER],
    requiresCompany: true,
  },
];
