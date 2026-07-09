/**
 * Formata números para pt-BR com suporte opcional a casas decimais.
 */
export function formatNumber(
  value: number,
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>,
): string {
  return new Intl.NumberFormat('pt-BR', options).format(value);
}

/**
 * Formata números como moeda BRL (pt-BR).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
