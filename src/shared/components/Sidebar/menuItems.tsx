import type { LucideIcon } from "lucide-react";
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
} from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  children?: MenuItem[];
}

export const viveirosSubmenuItems: MenuItem[] = [
  { id: 'viveiros-listagem', label: 'Viveiros', href: '/tanques' },
  { id: 'sensores', label: 'Sensores', href: '/sensores' },
  { id: 'monitoramento', label: 'Monitoramento', href: '/monitoramento' },
  { id: 'qualidade-agua', label: 'Qualidade da água', href: '/qualidade-agua' },
];

export const producaoSubmenuItems: MenuItem[] = [
  { id: 'lotes', label: 'Lotes', href: '/lotes' },
  { id: 'povoamentos', label: 'Povoamentos', href: '/povoamentos' },
  { id: 'alimentacoes', label: 'Alimentações', href: '/alimentacao' },
  { id: 'biometrias', label: 'Biometrias', href: '/biometrias' },
  { id: 'mortalidades', label: 'Mortalidades', href: '/mortalidades' },
  { id: 'transferencias', label: 'Transferências', href: '/transferencias' },
  { id: 'despescas', label: 'Despescas', href: '/despescas' },
];

export const insumosEstoqueSubmenuItems: MenuItem[] = [
  { id: 'insumos-produtos', label: 'Insumos/Produtos', href: '/insumos' },
  { id: 'compras', label: 'Compras', href: '/compras' },
  { id: 'fornecedores', label: 'Fornecedores', href: '/fornecedores' },
  { id: 'estoques', label: 'Estoques', href: '/estoques' },
  { id: 'estoques-transacoes', label: 'Movimentações de estoque', href: '/estoques-transacoes' },
];

export const financeiroSubmenuItems: MenuItem[] = [
  { id: 'categorias-financeiras', label: 'Categorias financeiras', href: '/categorias-financeiras' },
  { id: 'contas-financeiras', label: 'Contas financeiras', href: '/contas-financeiras' },
  { id: 'transacoes-financeiras', label: 'Transações financeiras', href: '/transacoes-financeiras' },
];

export const comercialSubmenuItems: MenuItem[] = [
  { id: 'clientes', label: 'Clientes', href: '/clientes' },
  { id: 'orcamentos', label: 'Orçamentos', href: '/orcamentos' },
  { id: 'pedidos', label: 'Pedidos', href: '/pedidos' },
  { id: 'vendas', label: 'Vendas', href: '/vendas' },
];

export const relatoriosSubmenuItems: MenuItem[] = [
  { id: 'rel-producao', label: 'Relatório de Produção', href: '/relatorios/producao' },
  { id: 'rel-comercial', label: 'Relatório Comercial', href: '/relatorios/comercial' },
  { id: 'rel-financeiro', label: 'Relatório Financeiro', href: '/relatorios/financeiro' },
  { id: 'rel-estoque', label: 'Relatório de Estoque', href: '/relatorios/estoque' },
  { id: 'rel-viveiros', label: 'Relatório de Viveiros', href: '/relatorios/viveiros' },
];

export const administracaoSubmenuItems: MenuItem[] = [
  { id: 'usuarios', label: 'Usuários', href: '/usuarios' },
  { id: 'configuracoes', label: 'Configurações', href: '/configuracoes' },
  { id: 'integracoes-iot', label: 'Integrações IoT', href: '/integracoes-iot' },
];

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
