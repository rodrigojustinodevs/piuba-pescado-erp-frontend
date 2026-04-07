'use client';

import { useQuery } from '@tanstack/react-query';
import type { FinancialCategoryStatus, FinancialCategoryType } from '../types';
import { financialCategoryService } from '../services/financialCategoryService';

interface UseFinancialCategoriesParams {
  page?: number;
  limit?: number;
  companyId?: string;
  type?: FinancialCategoryType;
  status?: FinancialCategoryStatus;
  enabled?: boolean;
}

export function useFinancialCategories({
  page = 1,
  limit = 25,
  companyId,
  type,
  status,
  enabled = true,
}: UseFinancialCategoriesParams = {}) {
  return useQuery({
    queryKey: ['financial-categories', 'list', page, limit, companyId, type, status],
    queryFn: () => financialCategoryService.list({ page, limit, companyId, type, status }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
