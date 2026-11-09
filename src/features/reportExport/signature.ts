/** Cópia ordenada (comparação explícita) para assinaturas estáveis de filtros. */
export const sortedCopy = (values: string[]): string[] =>
  [...values].sort((a, b) => a.localeCompare(b));
