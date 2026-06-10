/**
 * Catálogo mock de tipos de ração (substituir por lookup da API quando existir).
 * Mesmo estilo de constantes nomeadas usado em outros formulários (ex.: BatchForm).
 */
export const FEED_TYPE_OPTIONS: string[] = [
  'Ração inicial',
  'Ração crescimento',
  'Ração engorda',
  'Ração final',
  'Suplemento',
];

/** Opções para `<Select options={...} />` do formulário (value e label iguais ao catálogo). */
export const FEED_TYPE_SELECT_OPTIONS: { value: string; label: string }[] = FEED_TYPE_OPTIONS.map(
  (value) => ({ value, label: value }),
);
