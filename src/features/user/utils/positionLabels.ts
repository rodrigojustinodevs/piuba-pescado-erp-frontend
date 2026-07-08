export const Position = {
  ADMIN: 'admin',
  GENERAL_MANAGER: 'general_manager',
  PRODUCTION_MANAGER: 'production_manager',
  FIELD_OPERATOR: 'field_operator',
  SALES_MANAGER: 'sales_manager',
  SALES_REP: 'sales_rep',
  FINANCIAL_ANALYST: 'financial_analyst',
  BILLING_CLERK: 'billing_clerk',
  LOGISTICS_DISPATCHER: 'logistics_dispatcher',
} as const;

export type PositionType = (typeof Position)[keyof typeof Position];

export const POSITION_LABELS: Record<string, string> = {
  [Position.ADMIN]: 'Administrador',
  [Position.GENERAL_MANAGER]: 'Gerente Geral',
  [Position.PRODUCTION_MANAGER]: 'Gerente de Produção',
  [Position.FIELD_OPERATOR]: 'Operador de Campo',
  [Position.SALES_MANAGER]: 'Gerente Comercial',
  [Position.SALES_REP]: 'Vendedor',
  [Position.FINANCIAL_ANALYST]: 'Analista Financeiro',
  [Position.BILLING_CLERK]: 'Faturista',
  [Position.LOGISTICS_DISPATCHER]: 'Expedição / Logística',
};

export function getPositionLabel(position?: string): string {
  if (!position) return '—';
  return POSITION_LABELS[position] ?? position;
}

export const POSITION_OPTIONS: Array<{ value: PositionType; label: string }> = [
  { value: Position.ADMIN, label: POSITION_LABELS[Position.ADMIN] },
  { value: Position.GENERAL_MANAGER, label: POSITION_LABELS[Position.GENERAL_MANAGER] },
  { value: Position.PRODUCTION_MANAGER, label: POSITION_LABELS[Position.PRODUCTION_MANAGER] },
  { value: Position.FIELD_OPERATOR, label: POSITION_LABELS[Position.FIELD_OPERATOR] },
  { value: Position.SALES_MANAGER, label: POSITION_LABELS[Position.SALES_MANAGER] },
  { value: Position.SALES_REP, label: POSITION_LABELS[Position.SALES_REP] },
  { value: Position.FINANCIAL_ANALYST, label: POSITION_LABELS[Position.FINANCIAL_ANALYST] },
  { value: Position.BILLING_CLERK, label: POSITION_LABELS[Position.BILLING_CLERK] },
  { value: Position.LOGISTICS_DISPATCHER, label: POSITION_LABELS[Position.LOGISTICS_DISPATCHER] },
];
