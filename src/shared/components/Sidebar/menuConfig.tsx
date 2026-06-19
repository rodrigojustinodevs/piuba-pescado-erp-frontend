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
  LayoutDashboard,
  Container,
  Fish,
  FileText,
  Settings,
  Building,
  PackageSearch,
  CircleDollarSign,
  ShoppingCart,
  Droplets,
} from 'lucide-react';

export interface MenuItemWithAuth extends Omit<MenuItem, 'children'> {
  allowedRoles?: UserRoleType[];
  requiresCompany?: boolean;
  children?: MenuItemWithAuth[];
}

const ROLES_ALL: UserRoleType[] = [
  UserRole.MASTER,
  UserRole.MASTER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.MANAGER,
  UserRole.OPERATOR,
];
const ROLES_COMPANY_ALL: UserRoleType[] = [
  UserRole.MASTER,
  UserRole.MASTER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.MANAGER,
  UserRole.OPERATOR,
];
const ROLES_COMPANY_ADMIN_MANAGER: UserRoleType[] = [
  UserRole.COMPANY_ADMIN,
  UserRole.MANAGER,
  UserRole.MASTER_ADMIN,
];
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

function tanksChildrenWithAuth(items: MenuItem[]): MenuItemWithAuth[] {
  return items.map((item) => ({
    ...item,
    allowedRoles: ROLES_COMPANY_ALL,
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
    icon: LayoutDashboard,
    href: '/dashboard',
    allowedRoles: ROLES_ALL,
  },
  {
    id: 'empresas',
    label: 'Empresas/Fazendas',
    icon: Building,
    href: '/admin/companies',
    allowedRoles: [UserRole.MASTER_ADMIN, UserRole.MASTER],
  },
  {
    id: 'viveiros',
    label: 'Viveiros',
    icon: Container,
    href: '/company/tanks',
    allowedRoles: ROLES_COMPANY_ALL,
    children: tanksChildrenWithAuth(viveirosSubmenuItems),
  },
  {
    id: 'producao',
    label: 'Produção',
    icon: Fish,
    href: '/company/production',
    allowedRoles: ROLES_COMPANY_ALL,
    children: childrenAllCompanyAdminManager(producaoSubmenuItems),
  },
  {
    id: 'insumos-estoque',
    label: 'Insumos & Estoque',
    icon: PackageSearch,
    allowedRoles: ROLES_COMPANY_ALL,
    children: childrenAllCompanyAdminManager(insumosEstoqueSubmenuItems),
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: CircleDollarSign,
    allowedRoles: ROLES_COMPANY_ALL,
    children: childrenAllCompanyAdminManager(financeiroSubmenuItems),
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: ShoppingCart,
    allowedRoles: ROLES_COMPANY_ALL,
    children: comercialChildrenWithAuth(comercialSubmenuItems),
  },
  {
    id: 'relatorios',
    label: 'Relatóriosa',
    icon: FileText,
    allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
    requiresCompany: REQUIRES_COMPANY,
    children: relatoriosChildrenWithAuth(relatoriosSubmenuItems),
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: Settings,
    href: '/dashboard/configuracoes',
    allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
    requiresCompany: REQUIRES_COMPANY,
    children: administracaoChildrenWithAuth(administracaoSubmenuItems),
  },
];
