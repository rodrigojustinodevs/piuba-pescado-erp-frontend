import type { ApiPagination } from '@/shared/types/api';

export interface Sale {
  id: string;
  code: string | null;
  totalWeight: number;
  pricePerKg: number;
  totalRevenue: number;
  saleDate: string;
  dueDate: string | null;
  paymentMethod: string | null;
  status: string;
  statusLabel: string;
  numberNf: string | null;
  notes: string | null;
  batchId: string | null;
  stockingId: string | null;
  financialCategoryId: string | null;
  isTotalHarvest: boolean;
  needsInvoice: boolean;
  companyName: string;
  clientId: string | null;
  clientName: string;
  batchName: string;
  discount: number;
  shipping: number;
  taxes: number;
  items: SaleItem[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiSaleItem {
  batchId?: string | null;
  batch?: { id: string; name: string } | null;
  batch_id?: string | null;
  stockingId?: string | null;
  stocking?: { id: string } | null;
  stocking_id?: string | null;
  totalWeight: number;
  pricePerKg: number;
  isTotalHarvest?: boolean;
  is_total_harvest?: boolean;
  category?: string | null;
  notes?: string | null;
}

export interface ApiSale {
  id: string;
  code?: string | null;
  totalWeight: number;
  pricePerKg: number;
  totalRevenue: number;
  saleDate: string;
  due_date?: string | null;
  dueDate?: string | null;
  payment_method?: string | null;
  paymentMethod?: string | null;
  status: string;
  statusLabel: string;
  number_nf?: string | null;
  invoiceNumber?: string | null;
  notes: string | null;
  batchId: string | null;
  stockingId: string | null;
  stocking_id?: string | null;
  financialCategoryId?: string | null;
  financial_category_id?: string | null;
  isTotalHarvest?: boolean;
  is_total_harvest?: boolean;
  needsInvoice?: boolean;
  needs_invoice?: boolean;
  requiresInvoice?: boolean;
  requires_invoice?: boolean;
  discount?: number | null;
  shipping?: number | null;
  taxes?: number | null;
  items?: ApiSaleItem[];
  company?: { name: string } | null;
  client?: { id: string; name: string } | null;
  batch?: { id: string; name: string } | null;
  stocking?: { id: string } | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type ApiSaleListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiSale[] | { data?: ApiSale[] };
  pagination?: ApiPagination;
};

export interface SaleListResponse {
  sales: Sale[];
  total: number;
  page: number;
  limit: number;
}

export type SaleDialogMode = 'create' | 'edit' | 'view';

export type SaleStatus = 'pending' | 'confirmed' | 'paid' | 'delivered' | 'overdue' | 'cancelled';

export type SaleStatusFilter = 'all' | 'pending' | 'confirmed' | 'paid' | 'delivered' | 'overdue' | 'cancelled';

export type SaleUpdateStatus = 'pending' | 'confirmed';

export interface SaleItem {
  batchId: string | null;
  stockingId: string | null;
  totalWeight: number;
  pricePerKg: number;
  isTotalHarvest: boolean;
  category: string | null;
  notes: string | null;
}

export interface CreateSaleData {
  clientId: string;
  saleDate: string;
  financialCategoryId: string | null;
  responsibleUserId: string | null;
  dueDate: string | null;
  status: string;
  notes: string | null;
  needsInvoice: boolean;
  invoiceNumber: string | null;
  discount: number;
  shipping: number;
  taxes: number;
  paymentMethod: string | null;
  items: SaleItem[];
}

export interface UpdateSaleData extends CreateSaleData {
  id: string;
}
