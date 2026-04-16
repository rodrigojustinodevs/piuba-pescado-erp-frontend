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
import * as menuSubtrees from './menuSubtrees';

export type { MenuItem } from './types';
export {
  administracaoSubmenuItems,
  comercialSubmenuItems,
  financeiroSubmenuItems,
  insumosEstoqueSubmenuItems,
  producaoSubmenuItems,
  relatoriosSubmenuItems,
  viveirosSubmenuItems,
} from './menuSubtrees';

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
    children: menuSubtrees.viveirosSubmenuItems,
  },
  {
    id: 'producao',
    label: 'Produção',
    icon: Fish,
    children: menuSubtrees.producaoSubmenuItems,
  },
  {
    id: 'insumos-estoque',
    label: 'Insumos & Estoque',
    icon: PackageSearch,
    children: menuSubtrees.insumosEstoqueSubmenuItems,
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: CircleDollarSign,
    children: menuSubtrees.financeiroSubmenuItems,
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: ShoppingCart,
    children: menuSubtrees.comercialSubmenuItems,
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: FileText,
    children: menuSubtrees.relatoriosSubmenuItems,
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: Settings,
    children: menuSubtrees.administracaoSubmenuItems,
  },
];
