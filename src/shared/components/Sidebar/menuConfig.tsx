'use client';

import type { MenuItem } from './types';
import { UserRole, type UserRoleType } from '@/shared/types/auth';
import {
  BatchIcon,
  BuildingIcon,
  DashboardIcon,
  OrdersIcon,
  ProductsIcon,
  ReportsIcon,
  SettingsIcon,
  TankIcon,
} from './menuIcons';

/**
 * Interface estendida para itens de menu com controle de acesso
 */
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
  },
  {
    id: 'lotes',
    label: 'Lotes',
    icon: <BatchIcon />,
    href: '/company/batches',
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
