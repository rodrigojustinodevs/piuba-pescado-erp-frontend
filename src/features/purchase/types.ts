/**
 * Compras — contrato com GET /api/company/purchases
 */

import type { ApiPagination } from '@/shared/types/api';

export type PurchaseStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'partially_received'
  | 'received'
  | 'cancelled';

export type PurchasePaymentStatus = 'pending' | 'partial' | 'paid';

export type PurchasePaymentMethod =
  | 'bank_slip'
  | 'pix'
  | 'bank_transfer'
  | 'credit_card'
  | 'cash'
  | 'net_terms';

export const STATUS_LABELS: Record<PurchaseStatus, string> = {
  draft: 'Rascunho',
  submitted: 'Enviada',
  approved: 'Aprovada',
  partially_received: 'Recebimento Parcial',
  received: 'Recebida',
  cancelled: 'Cancelada',
};

export const PAYMENT_STATUS_LABELS: Record<PurchasePaymentStatus, string> = {
  pending: 'Pendente',
  partial: 'Parcial',
  paid: 'Pago',
};

export const PAYMENT_METHOD_LABELS: Record<PurchasePaymentMethod, string> = {
  bank_slip: 'Boleto',
  pix: 'PIX',
  bank_transfer: 'Transferência',
  credit_card: 'Cartão',
  cash: 'Dinheiro',
  net_terms: 'A Prazo',
};
export interface ApiPurchasePayment {
  id: string;
  purchaseId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference: string | null;
  notes: string | null;
  createdAt: string;
}

export interface PurchasePayment {
  id: string;
  purchaseId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference: string | null;
  notes: string | null;
  createdAt: string;
}

export interface PurchasePaymentSummary {
  id: string;
  code: string;
  totalAmount: number;
  totalPaid: number;
  balance: number;
  progress: number;
  paymentStatus: string;
}

export interface PurchasePaymentsResponse {
  summary: PurchasePaymentSummary;
  payments: PurchasePayment[];
}

export interface CreatePaymentData {
  payment_date: string;
  amount: number;
  payment_method: string;
  reference?: string;
  notes?: string;
}

export interface ApiPurchaseItem {
  id: string;
  supplyId: string;
  supplyName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity?: number;
}

export interface ApiPurchase {
  id: string;
  code: string;
  companyId: string;
  supplierId: string;
  invoiceNumber: string | null;
  totalPrice: number;
  freight: number;
  otherCosts: number;
  status: string;
  statusLabel: string;
  paymentStatus: string;
  paymentStatusLabel: string;
  paymentMethod: string | null;
  paymentMethodLabel: string | null;
  orderDate: string;
  expectedDate: string | null;
  receivedDate: string | null;
  notes: string | null;
  responsible: string | null;
  paidAmount?: number;
  createdAt: string;
  updatedAt: string;
  company?: { id: string; name: string };
  supplier?: { id: string; name: string };
  items?: ApiPurchaseItem[];
}

export type ApiPurchaseListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiPurchase[] | { data?: ApiPurchase[] };
  pagination?: ApiPagination;
};

export interface PurchaseItem {
  id: string;
  supplyId: string;
  supplyName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
}

export interface Purchase {
  id: string;
  referenceCode: string;
  companyId: string;
  supplierId: string;
  invoiceNumber: string | null;
  totalPrice: number;
  freightCost: number;
  otherCosts: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  orderDate: string;
  expectedDeliveryDate: string | null;
  receivedAt: string | null;
  notes: string | null;
  responsibleName: string | null;
  paidAmount: number;
  createdAt: string;
  updatedAt: string;
  companyName: string;
  supplierName: string;
  items: PurchaseItem[];
}

export interface PurchaseListResponse {
  purchases: Purchase[];
  total: number;
  page: number;
  limit: number;
}

/** Item enviado em POST /api/company/purchases */
export interface CreatePurchaseItemData {
  supplyId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
}

/** Corpo de criação (sem total geral — calculado no backend) */
export interface CreatePurchaseData {
  companyId: string;
  supplierId: string;
  invoiceNumber: string | null;
  orderDate: string;
  status: string;
  paymentStatus?: string;
  items: CreatePurchaseItemData[];
  referenceCode?: string;
  responsibleName?: string;
  paymentMethod?: string;
  expectedDeliveryDate?: string | null;
  freightCost?: number;
  otherCosts?: number;
  notes?: string;
}

export interface UpdatePurchaseData extends CreatePurchaseData {
  id: string;
}

/** Linhas genéricas de listagens (fornecedores / insumos) */
export interface ApiNamedRow {
  id: string;
  name: string;
  unit?: string;
}

export type ApiNamedListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiNamedRow[] | { data?: ApiNamedRow[] };
  pagination?: ApiPagination;
};

export interface SupplierOption {
  id: string;
  name: string;
  document?: string;
}

export interface SupplyOption {
  id: string;
  name: string;
  unit: string;
  unitCost?: number;
  sku?: string;
  category?: string | null;
}

export interface SupplierListResponse {
  suppliers: SupplierOption[];
  total: number;
  page: number;
  limit: number;
}

export interface SupplyListResponse {
  supplies: SupplyOption[];
  total: number;
  page: number;
  limit: number;
}

export type PurchaseDialogMode = 'create' | 'edit' | 'view';

export interface PurchaseCatalogStats {
  totalPurchases: number;
  pendingCount: number;
  totalValue: number;
  receivedCount: number;
}
