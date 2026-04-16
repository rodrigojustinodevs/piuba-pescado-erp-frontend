import {
  LayoutDashboard,
  Container,
  Fish,
  PackageSearch,
  CircleDollarSign,
  ShoppingCart,
  FileText,
  Settings,
  Building,
} from 'lucide-react';

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

export type { MenuItem };
export {
  administracaoSubmenuItems,
  comercialSubmenuItems,
  financeiroSubmenuItems,
  insumosEstoqueSubmenuItems,
  producaoSubmenuItems,
  relatoriosSubmenuItems,
  viveirosSubmenuItems,
};

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    id: 'empresas',
    label: 'Empresas/Fazendas',
    icon: Building,
    href: '/empresas',
  },
  {
    id: 'viveiros',
    label: 'Viveiros',
    icon: Container,
    children: viveirosSubmenuItems,
  },
  {
    id: 'producao',
    label: 'Produção',
    icon: Fish,
    children: producaoSubmenuItems,
  },
  {
    id: 'insumos-estoque',
    label: 'Insumos & Estoque',
    icon: PackageSearch,
    children: insumosEstoqueSubmenuItems,
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: CircleDollarSign,
    children: financeiroSubmenuItems,
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: ShoppingCart,
    children: comercialSubmenuItems,
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: FileText,
    children: relatoriosSubmenuItems,
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: Settings,
    children: administracaoSubmenuItems,
  },
];
