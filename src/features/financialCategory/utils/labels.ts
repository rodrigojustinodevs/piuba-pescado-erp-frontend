import type { FinancialCategory } from '../types';

const TYPE_LABELS: Record<string, string> = {
  revenue: 'Receita',
  income: 'Receita',
  expense: 'Despesa',
  investment: 'Investimento',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
};

/** Normaliza rótulos em inglês (ou mistos) vindos da API para exibição em PT-BR. */
const TYPE_LABEL_EN_PT: Record<string, string> = {
  ...TYPE_LABELS,
  receita: 'Receita',
  despesa: 'Despesa',
  investimento: 'Investimento',
};

const STATUS_LABEL_EN_PT: Record<string, string> = {
  ...STATUS_LABELS,
  ativo: 'Ativo',
  inativo: 'Inativo',
};

function normalizeLabelToPt(
  raw: string | null | undefined,
  map: Record<string, string>,
): string | null {
  const key = raw?.trim().toLowerCase();
  if (!key) return null;
  return map[key] ?? null;
}

export function labelFinancialCategoryType(type: string): string {
  return TYPE_LABELS[type] ?? type;
}

export function labelFinancialCategoryStatus(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

/** Texto da coluna Tipo: prioriza código conhecido; traduz label da API quando possível. */
export function displayFinancialCategoryType(row: Pick<FinancialCategory, 'type' | 'typeLabel'>): string {
  const fromCode = TYPE_LABELS[row.type];
  if (fromCode) return fromCode;
  const fromLabel = normalizeLabelToPt(row.typeLabel, TYPE_LABEL_EN_PT);
  if (fromLabel) return fromLabel;
  if (row.typeLabel?.trim()) return row.typeLabel.trim();
  return row.type || '—';
}

/** Texto da coluna Status: prioriza código conhecido; traduz label da API quando possível. */
export function displayFinancialCategoryStatus(
  row: Pick<FinancialCategory, 'status' | 'statusLabel'>,
): string {
  const fromCode = STATUS_LABELS[row.status];
  if (fromCode) return fromCode;
  const fromLabel = normalizeLabelToPt(row.statusLabel, STATUS_LABEL_EN_PT);
  if (fromLabel) return fromLabel;
  if (row.statusLabel?.trim()) return row.statusLabel.trim();
  return row.status || '—';
}
