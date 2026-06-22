export function formatNumber(value: number): string {
  return Number.isFinite(value) ? String(value) : '—';
}

export function formatSampleWeight(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '—';
  return formatNumber(value);
}

export function formatSampleQuantity(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '—';
  return String(Math.trunc(value));
}
