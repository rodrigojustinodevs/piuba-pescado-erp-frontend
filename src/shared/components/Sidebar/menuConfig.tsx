'use client';

import type { MenuItem } from './types';
import {
  administracaoSubmenuItems,
  comercialSubmenuItems,
  financeiroSubmenuItems,
  insumosEstoqueSubmenuItems,
  producaoSubmenuItems,
  relatoriosSubmenuItems,
  viveirosSubmenuItems,
} from './menuSubtrees';
import { UserRole, type UserRoleType } from '@/shared/types/auth';
import {
  BatchIcon,
  BuildingIcon,
  DashboardIcon,
  MoneyIcon,
  OrdersIcon,
  ProductsIcon,
  ReportsIcon,
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

function childrenAllCompanyAdminManager(items: MenuItem[]): MenuItemWithAuth[] {
  return items.map((item) => ({
    ...item,
    allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
  }));
}

function comercialChildrenWithAuth(items: MenuItem[]): MenuItemWithAuth[] {
  return items.map((item) => ({
    ...item,
    allowedRoles: item.id === 'pedidos' ? ROLES_COMPANY_ALL : ROLES_COMPANY_ADMIN_MANAGER,
  }));
}

function relatoriosChildrenWithAuth(items: MenuItem[]): MenuItemWithAuth[] {
  return items.map((item) => ({
    ...item,
    allowedRoles: item.id === 'estoque' ? [UserRole.COMPANY_ADMIN] : ROLES_COMPANY_ADMIN_MANAGER,
  }));
}

function administracaoChildrenWithAuth(items: MenuItem[]): MenuItemWithAuth[] {
  return items.map((item) => ({
    ...item,
    allowedRoles: item.id === 'integracoes-iot' ? [UserRole.MASTER] : ROLES_COMPANY_ADMIN_MANAGER,
  }));
}

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
    label: 'Empresas/Fazendas',
    icon: <BuildingIcon />,
    href: '/admin/companies',
    allowedRoles: [UserRole.MASTER],
  },
  {
    id: 'viveiros',
    label: 'Viveiros',
    icon: <TankIcon />,
    href: '/company/tanks',
    allowedRoles: ROLES_COMPANY_ALL,
    requiresCompany: REQUIRES_COMPANY,
    children: childrenAllCompanyAdminManager(viveirosSubmenuItems),
  },
  {
    id: 'producao',
    label: 'Produção',
    icon: <BatchIcon />,
    href: '/company/production',
    allowedRoles: ROLES_COMPANY_ALL,
    requiresCompany: REQUIRES_COMPANY,
    children: childrenAllCompanyAdminManager(producaoSubmenuItems),
  },
  {
    id: 'insumos-estoque',
    label: 'Insumos & Estoque',
    icon: <ProductsIcon />,
    allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
    requiresCompany: REQUIRES_COMPANY,
    children: childrenAllCompanyAdminManager(insumosEstoqueSubmenuItems),
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: <MoneyIcon />,
    allowedRoles: [UserRole.COMPANY_ADMIN],
    requiresCompany: REQUIRES_COMPANY,
    children: childrenAllCompanyAdminManager(financeiroSubmenuItems),
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: <OrdersIcon />,
    allowedRoles: ROLES_COMPANY_ALL,
    requiresCompany: REQUIRES_COMPANY,
    children: comercialChildrenWithAuth(comercialSubmenuItems),
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: <ReportsIcon />,
    allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
    requiresCompany: REQUIRES_COMPANY,
    children: relatoriosChildrenWithAuth(relatoriosSubmenuItems),
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: <SettingsIcon />,
    href: '/dashboard/configuracoes',
    allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
    requiresCompany: REQUIRES_COMPANY,
    children: administracaoChildrenWithAuth(administracaoSubmenuItems),
  },
];
