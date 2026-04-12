'use client';

import type { MenuItem } from './types';
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
    children: [
      {
        id: 'tanques',
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
    children: [
      {
        id: 'insumos-produtos',
        label: 'Insumos/Produtos',
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
    id: 'financeiro',
    label: 'Financeiro',
    icon: <MoneyIcon />,
    children: [
      {
        id: 'categorias-financeiras',
        label: 'Categorias financeiras',
        href: '/company/financial-categories',
      },
      {
        id: 'contas-financeiras',
        label: 'Contas financeiras',
        href: '/company/financial-accounts',
      },
      {
        id: 'transacoes-financeiras',
        label: 'Transações financeiras',
        href: '/company/financial-transactions',
      },
    ],
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: <OrdersIcon />,
    children: [
      {
        id: 'clientes',
        label: 'Clientes',
        href: '/company/clients',
      },
      {
        id: 'orcamentos',
        label: 'Orçamentos',
        href: '/dashboard/orcamentos',
      },
      {
        id: 'pedidos',
        label: 'Pedidos',
        href: '/dashboard/pedidos',
      },
      {
        id: 'vendas-erp',
        label: 'Vendas',
        href: '/company/sales',
      },
    ],
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: <ReportsIcon />,
    children: [
      {
        id: 'producao',
        label: 'Relatório de Produção',
        href: '/dashboard/relatorios/producao',
      },
      {
        id: 'comercial',
        label: 'Relatório de Comercial',
        href: '/dashboard/relatorios/comercial',
      },
      {
        id: 'financeiro',
        label: 'Relatório de Financeiro',
        href: '/dashboard/relatorios/financeiro',
      },
      {
        id: 'estoque',
        label: 'Relatório de Estoque',
        href: '/dashboard/relatorios/estoque',
      },
      {
        id: 'viveiros',
        label: 'Relatório de Viveiros',
        href: '/dashboard/relatorios/viveiros',
      },
    ],
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: <SettingsIcon />,
    href: '/dashboard/configuracoes',
    children: [
      {
        id: 'usuarios',
        label: 'Usuários',
        href: '/dashboard/usuarios',
      },
      {
        id: 'configuracoes',
        label: 'Configurações',
        href: '/dashboard/configuracoes',
      },
      {
        id: 'integracoes-iot',
        label: 'Integrações IoT',
        href: '/admin/iot-integrations',
      },
    ],
  },
];
