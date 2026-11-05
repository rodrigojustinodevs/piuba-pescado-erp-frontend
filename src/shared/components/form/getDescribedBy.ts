/** Retorna o id do elemento de erro ou ajuda associado ao campo (para aria-describedby). */
export function getDescribedBy(
  fieldId: string,
  error?: unknown,
  helperText?: unknown,
): string | undefined {
  if (error) return `${fieldId}-error`;
  if (helperText) return `${fieldId}-helper`;
  return undefined;
}
