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
import {
  BatchIcon,
  BuildingIcon,
  DashboardIcon,
  OrdersIcon,
  ProductsIcon,
  ReportsIcon,
  SettingsIcon,
  TankIcon,
  MoneyIcon,
} from './menuIcons';

/**
 * Itens de menu padrão - pode ser customizado
 */
export const defaultMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    href: '/dashboard',
  },
  {
    id: 'empresas',
    label: 'Empresas/Fazendas',
    icon: <BuildingIcon />,
    href: '/admin/companies',
  },
  {
    id: 'viveiros',
    label: 'Viveiros',
    icon: <TankIcon />,
    href: '/company/tanks',
    children: viveirosSubmenuItems,
  },
  {
    id: 'producao',
    label: 'Produção',
    icon: <BatchIcon />,
    href: '/company/production',
    children: producaoSubmenuItems,
  },
  {
    id: 'insumos-estoque',
    label: 'Insumos & Estoque',
    icon: <ProductsIcon />,
    children: insumosEstoqueSubmenuItems,
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: <MoneyIcon />,
    children: financeiroSubmenuItems,
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: <OrdersIcon />,
    children: comercialSubmenuItems,
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: <ReportsIcon />,
    children: relatoriosSubmenuItems,
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: <SettingsIcon />,
    href: '/dashboard/configuracoes',
    children: administracaoSubmenuItems,
  },
];
