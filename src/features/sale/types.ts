import type { ApiPagination } from '@/shared/types/api';

export interface Sale {
  id: string;
  totalWeight: number;
  pricePerKg: number;
  totalRevenue: number;
  saleDate: string;
  status: string;
  statusLabel: string;
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
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiSale {
  id: string;
  totalWeight: number;
  pricePerKg: number;
  totalRevenue: number;
  saleDate: string;
  status: string;
  statusLabel: string;
  notes: string | null;
  batchId: string | null;
  stockingId: string | null;
  financialCategoryId?: string | null;
  financial_category_id?: string | null;
  isTotalHarvest?: boolean;
  is_total_harvest?: boolean;
  needsInvoice?: boolean;
  needs_invoice?: boolean;
  requiresInvoice?: boolean;
  requires_invoice?: boolean;
  company?: { name: string } | null;
  client?: { id: string; name: string } | null;
  batch?: { id: string; name: string } | null;
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

export type SaleStatus = 'pending' | 'confirmed' | 'cancelled';

export type SaleUpdateStatus = 'pending' | 'confirmed';

export interface CreateSaleData {
  clientId: string;
  batchId: string;
  stockingId: string;
  financialCategoryId: string;
  totalWeight: number;
  pricePerKg: number;
  saleDate: string;
  isTotalHarvest: boolean;
  needsInvoice: boolean;
  status: SaleStatus;
  notes: string | null;
}

export interface UpdateSaleData {
  id: string;
  totalWeight: number;
  pricePerKg: number;
  saleDate: string;
  status: SaleUpdateStatus;
  notes: string | null;
  isTotalHarvest: boolean;
}

