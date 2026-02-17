'use client';

import type { MenuItem } from './types';
import {
  BatchIcon,
  BuildingIcon,
  DashboardIcon,
  OrdersIcon,
  ProductsIcon,
  ReportsIcon,
  SettlementIcon,
  SettingsIcon,
  TankIcon,
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
    id: 'vendas',
    label: 'Vendas',
    icon: <OrdersIcon />,
    children: [
      {
        id: 'pedidos',
        label: 'Pedidos',
        href: '/dashboard/pedidos',
      },
      {
        id: 'orcamentos',
        label: 'Orçamentos',
        href: '/dashboard/orcamentos',
      },
      {
        id: 'clientes',
        label: 'Clientes',
        href: '/dashboard/clientes',
      },
    ],
  },
  {
    id: 'estoque',
    label: 'Estoque',
    icon: <ProductsIcon />,
    children: [
      {
        id: 'produtos',
        label: 'Produtos',
        href: '/dashboard/produtos',
      },
      {
        id: 'categorias',
        label: 'Categorias',
        href: '/dashboard/categorias',
      },
      {
        id: 'movimentacoes',
        label: 'Movimentações',
        href: '/dashboard/movimentacoes',
      },
    ],
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: <ReportsIcon />,
    children: [
      {
        id: 'vendas',
        label: 'Relatório de Vendas',
        href: '/dashboard/relatorios/vendas',
      },
      {
        id: 'estoque',
        label: 'Relatório de Estoque',
        href: '/dashboard/relatorios/estoque',
      },
    ],
  },
  {
    id: 'empresas',
    label: 'Empresas',
    icon: <BuildingIcon />,
    href: '/admin/companies',
  },
  {
    id: 'tanques',
    label: 'Tanques',
    icon: <TankIcon />,
    href: '/company/tanks',
  },
  {
    id: 'lotes',
    label: 'Lotes',
    icon: <BatchIcon />,
    href: '/company/batches',
  },
  {
    id: 'povoamentos',
    label: 'Povoamentos',
    icon: <SettlementIcon />,
    href: '/company/settlements',
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: <SettingsIcon />,
    href: '/dashboard/configuracoes',
  },
];
