export function getSupplyDefaultUnitLabel(unit: string | null | undefined): string {
  const key = unit?.toLowerCase?.().trim?.() ?? '';
  if (!key) return '—';

  switch (key) {
    case 'kg':
      return 'Kg';
    case 'g':
      return 'Gramas';
    case 'liter':
      return 'Litro';
    case 'ml':
      return 'ML';
    case 'unit':
      return 'Unidade';
    case 'box':
      return 'Caixa';
    case 'piece':
      return 'Peça';
    default:
      return unit ?? '—';
  }
}
