'use client';

import type { MenuItem } from './types';
import {
  BatchIcon,
  BiometryIcon,
  BuildingIcon,
  DashboardIcon,
  FeedingIcon,
  OrdersIcon,
  ProductsIcon,
  ReportsIcon,
  SensorIcon,
  StockingIcon,
  TransferIcon,
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
    ],
  },
  {
    id: 'lotes',
    label: 'Lotes',
    icon: <BatchIcon />,
    href: '/company/batches',
    children: [
      {
        id: 'lotes',
        label: 'Lotes',
        href: '/company/batches',
      },
      {
        id: 'mortalidades',
        label: 'Mortalidades',
        href: '/company/mortalities',
      },
    ],
  },
  {
    id: 'biometrias',
    label: 'Biometrias',
    icon: <BiometryIcon />,
    href: '/company/biometries',
  },
  {
    id: 'alimentacoes',
    label: 'Alimentações',
    icon: <FeedingIcon />,
    href: '/company/feedings',
  },
  {
    id: 'povoamentos',
    label: 'Povoamentos',
    icon: <StockingIcon />,
    href: '/company/stockings',
  },
  {
    id: 'transferencias',
    label: 'Transferências',
    icon: <TransferIcon />,
    href: '/company/transfers',
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: <SettingsIcon />,
    href: '/dashboard/configuracoes',
  },
];
