const LABELS: Record<string, string> = {
  draft: 'Rascunho',
  submitted: 'Enviado',
  approved: 'Aprovado',
  partially_received: 'Parcialmente Recebido',
  received: 'Recebido',
  cancelled: 'Cancelado',
};

export function getPurchaseStatusLabel(status: string): string {
  const key = status?.toLowerCase?.() ?? '';
  return LABELS[key] ?? (status ? status : '—');
}
