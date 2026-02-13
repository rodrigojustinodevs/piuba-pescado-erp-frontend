/**
 * Utilitários de formatação para o módulo Batch
 */

/**
 * Extrai apenas a parte da data (YYYY-MM-DD) de uma string ISO
 * Evita problemas de conversão de timezone
 */
function extractDatePart(dateString: string): string {
  return dateString.split("T")[0] ?? dateString;
}

/**
 * Valida se a string é um formato de data válido (YYYY-MM-DD)
 */
function isValidDateFormat(datePart: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(datePart);
}

/**
 * Formata componentes de data para pt-BR (dd/MM/yyyy)
 */
function formatDateComponents(year: number, month: number, day: number): string {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Formata data para exibição (dd/MM/yyyy)
 * Trata corretamente datas ISO para evitar problemas de timezone
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return "—";
  }

  try {
    const datePart = extractDatePart(dateString);

    if (!isValidDateFormat(datePart)) {
      // Fallback para parsing normal se não for formato YYYY-MM-DD
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) {
        return "—";
      }
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }

    const [year, month, day] = datePart.split("-").map(Number);

    if (!year || !month || !day) {
      return "—";
    }

    return formatDateComponents(year, month, day);
  } catch {
    return "—";
  }
}

/**
 * Formata quantidade numérica com separador de milhar (pt-BR)
 */
export function formatQuantity(value: number | undefined | null): string {
  if (value === undefined || value === null) {
    return "—";
  }

  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

const CULTIVATION_LABELS: Record<string, string> = {
  daycare: "Berçário",
} as const;

/**
 * Retorna label legível para o tipo de cultivo
 */
export function getCultivationLabel(cultivation: string): string {
  return CULTIVATION_LABELS[cultivation] ?? cultivation;
}

const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;
const HOURS_PER_DAY = 24;

/**
 * Calcula a diferença em dias entre duas datas
 */
function getDaysDifference(date1: Date, date2: Date): number {
  const diffMs = Math.abs(date1.getTime() - date2.getTime());
  const diffHours = Math.floor(diffMs / MILLISECONDS_PER_HOUR);
  return Math.floor(diffHours / HOURS_PER_DAY);
}

/**
 * Formata hora para exibição (HH:mm)
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formata data e hora para exibição relativa
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) {
    return "—";
  }

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    const now = new Date();
    const diffDays = getDaysDifference(now, date);

    if (diffDays === 0) {
      return `Hoje, ${formatTime(date)}`;
    }

    if (diffDays === 1) {
      return `Ontem, ${formatTime(date)}`;
    }

    return formatDate(dateString);
  } catch {
    return "—";
  }
}
