import { z } from 'zod';

export function addRequiredCompanyIssue(ctx: z.RefinementCtx) {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'Selecione a empresa',
    path: ['companyId'],
  });
}

export function withRequiredCompany<T extends z.ZodTypeAny>(schema: T, showCompanySelect: boolean): T {
  const getCompanyId = (value: unknown): string | undefined => {
    if (!value || typeof value !== 'object') return undefined;
    if (!('companyId' in value)) return undefined;
    const cid = (value as Record<string, unknown>).companyId;
    return typeof cid === 'string' ? cid : undefined;
  };

  return schema.superRefine((data: z.output<T>, ctx) => {
    const companyId = getCompanyId(data);
    if (showCompanySelect && !companyId?.trim()) {
      addRequiredCompanyIssue(ctx);
    }
  }) as T;
}

