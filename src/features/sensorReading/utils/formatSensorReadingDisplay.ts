/** Formatação compartilhada entre tabela e tela de detalhe da leitura. */

export function formatSensorReadingValue(value: number, unit: string): string {
  if (!Number.isFinite(value)) return '—';
  const u = unit?.trim() ? ` ${unit}` : '';
  return `${value}${u}`;
}
