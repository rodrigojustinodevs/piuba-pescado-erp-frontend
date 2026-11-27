'use client';

import type { MenuItem, NavGroup } from './types';
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
import type { Permission } from '@/shared/access/permissionMatrix';
import { rolesAtLeast, rolesWithPermission } from '@/shared/access/roles';
import { BILLING_ROLES } from '@/features/billing/utils/permissions';

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
} from 'lucide-react';

export interface MenuItemWithAuth extends Omit<MenuItem, 'children'> {
  allowedRoles?: UserRoleType[];
  requiresCompany?: boolean;
  children?: MenuItemWithAuth[];
}

/**
 * Visibilidade do menu = permissão de leitura da tela na matriz da API
 * (`PermissionsEnum::forRole`). O papel esconde; o plano só desabilita ações.
 * Telas sem permissão própria na API (povoamento, transferência, água, fornecedor,
 * insumo) seguem o papel mínimo da rota (operator).
 */
const MENU_PERMISSION: Record<string, Permission> = {
  dashboard: 'view-dashboard',
  'viveiros-listagem': 'view-tank',
  sensores: 'view-sensor',
  monitoramento: 'view-sensor-reading',
  lotes: 'view-batch',
  especies: 'view-species',
  alimentacoes: 'view-feeding',
  biometrias: 'view-biometry',
  mortalidades: 'view-mortality',
  despescas: 'view-harvest',
  compras: 'view-purchase',
  estoques: 'view-stock',
  'estoques-transacoes': 'view-stock',
  'categorias-financeiras': 'view-financial-category',
  'transacoes-financeiras': 'view-financial-transaction',
  clientes: 'view-client',
  'vendas-erp': 'view-sale',
  usuarios: 'view-user',
};

const REPORT_PERMISSION: Record<string, Permission> = {
  producao: 'view-production-report',
  comercial: 'view-commercial-report',
  financeiro: 'view-financial-report',
  estoque: 'view-inventory-report',
  viveiros: 'view-tank-report',
};

const ROLES_COMPANY_ALL: UserRoleType[] = rolesAtLeast('operator');

function rolesFor(id: string): UserRoleType[] {
  const permission = MENU_PERMISSION[id];
  return permission ? rolesWithPermission(permission) : ROLES_COMPANY_ALL;
}

function withAuth(items: MenuItem[]): MenuItemWithAuth[] {
  return items.map((item) => ({ ...item, allowedRoles: rolesFor(item.id), requiresCompany: true }));
}

function relatoriosChildrenWithAuth(items: MenuItem[]): MenuItemWithAuth[] {
  return items.map((item) => ({
    ...item,
    allowedRoles: rolesWithPermission(REPORT_PERMISSION[item.id] ?? 'view-report'),
    requiresCompany: true,
  }));
}

export interface NavGroupWithAuth extends Omit<NavGroup, 'items'> {
  items: MenuItemWithAuth[];
}

const geralItems: MenuItemWithAuth[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    allowedRoles: rolesFor('dashboard'),
  },
];

const operacaoItems: MenuItemWithAuth[] = [
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
    children: withAuth(viveirosSubmenuItems),
  },
  {
    id: 'producao',
    label: 'Produção',
    icon: Fish,
    allowedRoles: ROLES_COMPANY_ALL,
    children: withAuth(producaoSubmenuItems),
  },
  {
    id: 'insumos-estoque',
    label: 'Insumos & Estoque',
    icon: PackageSearch,
    allowedRoles: ROLES_COMPANY_ALL,
    children: withAuth(insumosEstoqueSubmenuItems),
  },
];

const gestaoItems: MenuItemWithAuth[] = [
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: CircleDollarSign,
    allowedRoles: ROLES_COMPANY_ALL,
    children: withAuth(financeiroSubmenuItems),
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: ShoppingCart,
    allowedRoles: ROLES_COMPANY_ALL,
    children: withAuth(comercialSubmenuItems),
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: FileText,
    allowedRoles: rolesWithPermission('view-report'),
    children: relatoriosChildrenWithAuth(relatoriosSubmenuItems),
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: Settings,
    href: '/dashboard/configuracoes',
    allowedRoles: rolesAtLeast('manager'),
    children: [
      ...withAuth(administracaoSubmenuItems),
      {
        id: 'assinatura',
        label: 'Assinatura',
        href: '/dashboard/assinatura',
        allowedRoles: BILLING_ROLES,
        requiresCompany: true,
      },
    ],
  },
];

/** Menu agrupado (label + items): fonte única da navegação lateral. */
export const menuGroupsConfig: NavGroupWithAuth[] = [
  { id: 'geral', label: 'Geral', items: geralItems },
  { id: 'operacao', label: 'Operação', items: operacaoItems },
  { id: 'gestao', label: 'Gestão', items: gestaoItems },
];

/** Lista plana, mantida por compatibilidade com consumidores existentes. */
export const menuConfig: MenuItemWithAuth[] = menuGroupsConfig.flatMap((group) => group.items);
