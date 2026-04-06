/** Timestamp para ordenar datas vindas da API (YYYY-MM-DD ou ISO completo). */
export function getCalendarDateSortTime(value: string | null | undefined): number {
  if (!value) return 0;
  const d = parseDateForDisplay(value);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

/** Data só com dia (YYYY-MM-DD): evita UTC meia-noite que exibe “um dia a menos” em pt-BR. */
function parseDateForDisplay(value: string): Date {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T12:00:00`);
  }
  return new Date(trimmed);
}

/** Formata data de calendário (API costuma mandar YYYY-MM-DD) em pt-BR no fuso local. */
export function formatCalendarDatePtBR(value: string | null | undefined): string {
  if (!value) return '—';
  try {
    const d = parseDateForDisplay(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return value;
  }
}

export function formatDatePtBR(dateString: string): string {
  const date = parseDateForDisplay(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Data/datetime em pt-BR para células de tabela: vazio → em dash, inválido devolve o valor original. */
export function formatNullableDatePtBR(value: string | null | undefined, withTime = false): string {
  if (!value) return '—';
  try {
    const d = parseDateForDisplay(value);
    if (Number.isNaN(d.getTime())) return value;
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    };
    return withTime ? d.toLocaleString('pt-BR', options) : d.toLocaleDateString('pt-BR', options);
  } catch {
    return value;
  }
}

export function formatRelativeDateTimePtBR(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 0) {
    return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diffDays === 1) {
    return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return formatDatePtBR(dateString);
}
