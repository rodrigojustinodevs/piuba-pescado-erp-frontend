'use client';

import type { MenuItem } from './types';
import { UserRole, type UserRoleType } from '@/shared/types/auth';
import {
  BatchIcon,
  BiometryIcon,
  BuildingIcon,
  DashboardIcon,
  FeedingIcon,
  MoneyIcon,
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
    children: [
      {
        id: 'viveiros',
        label: 'Viveiros',
        href: '/company/tanks',
      },
      {
        id: 'sensores',
        label: 'Sensores',
        href: '/company/sensors',
      },
      {
        id: 'monitoramento',
        label: 'Monitoramento',
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
    id: 'producao',
    label: 'Produção',
    icon: <BatchIcon />,
    href: '/company/production',
    allowedRoles: ROLES_COMPANY_ALL,
    requiresCompany: REQUIRES_COMPANY,
    children: [
      {
        id: 'lotes',
        label: 'Lotes',
        href: '/company/batches',
      },

      {
        id: 'povoamentos',
        label: 'Povoamentos',
        href: '/company/stockings',
      },
      {
        id: 'alimentacoes',
        label: 'Alimentações',
        href: '/company/feedings',
      },
      {
        id: 'biometrias',
        label: 'Biometrias',
        href: '/company/biometries',
      },
      {
        id: 'mortalidades',
        label: 'Mortalidades',
        href: '/company/mortalities',
      },
      {
        id: 'transferencias',
        label: 'Transferências',
        href: '/company/transfers',
      },
      {
        id: 'despescas',
        label: 'Despescas',
        href: '/company/disposals',
      },
    ],
  },

  {
    id: 'insumos-estoque',
    label: 'Insumos & Estoque',
    icon: <ProductsIcon />,
    allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
    requiresCompany: REQUIRES_COMPANY,
    children: [
      {
        id: 'insumos-produtos',
        label: 'Insumos/Produtos',
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
    id: 'financeiro',
    label: 'Financeiro',
    icon: <MoneyIcon />,
    allowedRoles: [UserRole.COMPANY_ADMIN],
    requiresCompany: REQUIRES_COMPANY,
    children: [
      {
        id: 'categorias-financeiras',
        label: 'Categorias financeiras',
        href: '/company/financial-categories',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'contas-financeiras',
        label: 'Contas financeiras',
        href: '/company/financial-accounts',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'transacoes-financeiras',
        label: 'Transações financeiras',
        href: '/company/financial-transactions',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
    ],
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: <OrdersIcon />,
    allowedRoles: ROLES_COMPANY_ALL,
    requiresCompany: REQUIRES_COMPANY,
    children: [
      {
        id: 'clientes',
        label: 'Clientes',
        href: '/company/clients',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'orcamentos',
        label: 'Orçamentos',
        href: '/dashboard/orcamentos',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'pedidos',
        label: 'Pedidos',
        href: '/dashboard/pedidos',
        allowedRoles: ROLES_COMPANY_ALL,
      },
      {
        id: 'vendas-erp',
        label: 'Vendas',
        href: '/company/sales',
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
        id: 'producao',
        label: 'Relatório de Produção',
        href: '/dashboard/relatorios/producao',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'comercial',
        label: 'Relatório de Comercial',
        href: '/dashboard/relatorios/comercial',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'financeiro',
        label: 'Relatório de Financeiro',
        href: '/dashboard/relatorios/financeiro',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'estoque',
        label: 'Relatório de Estoque',
        href: '/dashboard/relatorios/estoque',
        allowedRoles: [UserRole.COMPANY_ADMIN],
      },
      {
        id: 'viveiros',
        label: 'Relatório de Viveiros',
        href: '/dashboard/relatorios/viveiros',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
    ],
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: <SettingsIcon />,
    href: '/dashboard/configuracoes',
    allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
    requiresCompany: REQUIRES_COMPANY,
    children: [
      {
        id: 'usuarios',
        label: 'Usuários',
        href: '/dashboard/usuarios',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'configuracoes',
        label: 'Configurações',
        href: '/dashboard/configuracoes',
        allowedRoles: ROLES_COMPANY_ADMIN_MANAGER,
      },
      {
        id: 'integracoes-iot',
        label: 'Integrações IoT',
        href: '/admin/iot-integrations',
        allowedRoles: [UserRole.MASTER],
      },
    ],
  },
];
