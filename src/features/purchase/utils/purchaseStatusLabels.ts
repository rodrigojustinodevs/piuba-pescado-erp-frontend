const LABELS: Record<string, string> = {
  draft: 'Rascunho',
  confirmed: 'Confirmado',
  received: 'Recebido',
  cancelled: 'Cancelado',
  pending: 'Pendente',
  ordered: 'Pedido',
};

export function getPurchaseStatusLabel(status: string): string {
  const key = status?.toLowerCase?.() ?? '';
  return LABELS[key] ?? (status ? status : '—');
}
