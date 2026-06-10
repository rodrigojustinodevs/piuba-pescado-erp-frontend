/**
 * Formata números para pt-BR com suporte opcional a casas decimais.
 */
export function formatNumber(
  value: number,
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>,
): string {
  return new Intl.NumberFormat('pt-BR', options).format(value);
}
