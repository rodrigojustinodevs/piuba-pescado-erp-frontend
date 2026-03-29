/** Converte valor de `datetime-local` para `YYYY-MM-DD HH:mm:ss` (backend). */
export function toMeasuredAtBackendString(value: string): string {
  if (!value) return '';
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Converte string da API (ISO ou `YYYY-MM-DD HH:mm:ss`) para `datetime-local`. */
export function toDateTimeLocalInputValue(value: string | null): string {
  if (!value) return '';
  let d = new Date(value);
  if (Number.isNaN(d.getTime()) && value.includes(' ') && !value.includes('T')) {
    d = new Date(value.replace(' ', 'T'));
  }
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
