/**
 * Compras — contrato com GET /api/company/purchases
 */

import type { ApiPagination } from '@/shared/types/api';

export interface ApiPurchaseItem {
  id: string;
  supplyId: string;
  supplyName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface ApiPurchase {
  id: string;
  companyId: string;
  supplierId: string;
  invoiceNumber: string | null;
  totalPrice: number;
  status: string;
  purchaseDate: string;
  receivedAt: string | null;
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
}

export interface Purchase {
  id: string;
  companyId: string;
  supplierId: string;
  invoiceNumber: string | null;
  totalPrice: number;
  status: string;
  purchaseDate: string;
  receivedAt: string | null;
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
}

/** Corpo de criação (sem total geral — calculado no backend) */
export interface CreatePurchaseData {
  companyId: string;
  supplierId: string;
  invoiceNumber: string | null;
  purchaseDate: string;
  status: string;
  items: CreatePurchaseItemData[];
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
}

export interface SupplyOption {
  id: string;
  name: string;
  unit: string;
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
 