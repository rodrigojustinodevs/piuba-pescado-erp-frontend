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
    id: 'empresas',
    label: 'Empresas',
    icon: <BuildingIcon />,
    href: '/admin/companies',
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
        href: '/company/clients',
      },
      {
        id: 'vendas-erp',
        label: 'Vendas',
        href: '/company/sales',
      },
    ],
  },
  {
    id: 'estoque',
    label: 'Estoque',
    icon: <ProductsIcon />,
    children: [
      {
        id: 'produtos-insumos',
        label: 'Produtos',
        href: '/company/supplies',
      },
      {
        id: 'compras',
        label: 'Compras',
        href: '/company/purchases',
      },
      {
        id: 'fornecedores',
        label: 'Fornecedores',
        href: '/company/suppliers',
      },
      {
        id: 'estoques',
        label: 'Estoques',
        href: '/company/stocks',
      },
      {
        id: 'estoques-transacoes',
        label: 'Movimentações de estoque',
        href: '/company/stocks-transations',
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
