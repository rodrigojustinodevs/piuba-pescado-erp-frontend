import type { PaymentMethod, SaleStatusFilter } from './types';

export const SALE_STATUS_LABELS: Record<SaleStatusFilter, string> = {
  all: 'Todas (exceto canceladas)',
  pending: 'Pendente',
  confirmed: 'Confirmada',
  paid: 'Paga',
  delivered: 'Entregue',
  overdue: 'Vencida',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: 'Pix',
  bank_slip: 'Boleto',
  bank_transfer: 'Transferência',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  cash: 'Dinheiro',
  check: 'Cheque',
};

export const COMMERCIAL_EXPORT_STORAGE_KEY = 'commercial-report:export';
