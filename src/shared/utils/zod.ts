import { z } from 'zod';

export function addRequiredCompanyIssue(ctx: z.RefinementCtx) {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'Selecione a empresa',
    path: ['companyId'],
  });
}

