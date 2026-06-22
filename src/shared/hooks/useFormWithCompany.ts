'use client';

import { useMemo } from 'react';
import type { ZodTypeAny } from 'zod';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { useCompanyOptions } from './useCompanyOptions';
import { addRequiredCompanyIssue } from '@/shared/utils/zod';

export function useFormWithCompany<T extends ZodTypeAny>(baseSchema: T) {
  const { user, isMaster } = useAuthContext();
  const showCompanySelect = isMaster();

  const resolverSchema = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (baseSchema as any).superRefine((data: { companyId?: string }, ctx: import('zod').RefinementCtx) => {
        if (showCompanySelect && !data.companyId?.trim()) {
          addRequiredCompanyIssue(ctx);
        }
      }),
    [baseSchema, showCompanySelect],
  );

  const { loadingCompanies, companyOptions } = useCompanyOptions(showCompanySelect);

  return { user, showCompanySelect, resolverSchema, loadingCompanies, companyOptions };
}
