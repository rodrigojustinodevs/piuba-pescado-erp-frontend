import type { MenuItem } from './types';

/** Filhos compartilhados entre `menuItems` e `menuConfig` (evita duplicidade Sonar). */
export const viveirosSubmenuItems: MenuItem[] = [
  { id: 'viveiros-listagem', label: 'Viveiros', href: '/company/tanks' },
  { id: 'sensores', label: 'Sensores', href: '/company/sensors' },
  { id: 'monitoramento', label: 'Monitoramento', href: '/company/sensor-readings' },
  { id: 'qualidade-agua', label: 'Qualidade da água', href: '/company/water-qualities' },
];

export const producaoSubmenuItems: MenuItem[] = [
  { id: 'lotes', label: 'Lotes', href: '/company/batches' },
  { id: 'povoamentos', label: 'Povoamentos', href: '/company/stockings' },
  { id: 'alimentacoes', label: 'Alimentações', href: '/company/feedings' },
  { id: 'biometrias', label: 'Biometrias', href: '/company/biometries' },
  { id: 'mortalidades', label: 'Mortalidades', href: '/company/mortalities' },
  { id: 'transferencias', label: 'Transferências', href: '/company/transfers' },
  { id: 'despescas', label: 'Despescas', href: '/company/disposals' },
];

export const insumosEstoqueSubmenuItems: MenuItem[] = [
  { id: 'insumos-produtos', label: 'Insumos/Produtos', href: '/company/supplies' },
  { id: 'compras', label: 'Compras', href: '/company/purchases' },
  { id: 'fornecedores', label: 'Fornecedores', href: '/company/suppliers' },
  { id: 'estoques', label: 'Estoques', href: '/company/stocks' },
  { id: 'estoques-transacoes', label: 'Movimentações de estoque', href: '/company/stocks-transations' },
];

export const financeiroSubmenuItems: MenuItem[] = [
  { id: 'categorias-financeiras', label: 'Categorias financeiras', href: '/company/financial-categories' },
  { id: 'contas-financeiras', label: 'Contas financeiras', href: '/company/financial-accounts' },
  { id: 'transacoes-financeiras', label: 'Transações financeiras', href: '/company/financial-transactions' },
];

export const comercialSubmenuItems: MenuItem[] = [
  { id: 'clientes', label: 'Clientes', href: '/company/clients' },
  { id: 'orcamentos', label: 'Orçamentos', href: '/dashboard/orcamentos' },
  { id: 'pedidos', label: 'Pedidos', href: '/dashboard/pedidos' },
  { id: 'vendas-erp', label: 'Vendas', href: '/company/sales' },
];

export const relatoriosSubmenuItems: MenuItem[] = [
  { id: 'producao', label: 'Relatório de Produção', href: '/dashboard/relatorios/producao' },
  { id: 'comercial', label: 'Relatório de Comercial', href: '/dashboard/relatorios/comercial' },
  { id: 'financeiro', label: 'Relatório de Financeiro', href: '/dashboard/relatorios/financeiro' },
  { id: 'estoque', label: 'Relatório de Estoque', href: '/dashboard/relatorios/estoque' },
  { id: 'viveiros', label: 'Relatório de Viveiros', href: '/dashboard/relatorios/viveiros' },
];

export const administracaoSubmenuItems: MenuItem[] = [
  { id: 'usuarios', label: 'Usuários', href: '/dashboard/usuarios' },
  { id: 'configuracoes', label: 'Configurações', href: '/dashboard/configuracoes' },
  { id: 'integracoes-iot', label: 'Integrações IoT', href: '/admin/iot-integrations' },
];
