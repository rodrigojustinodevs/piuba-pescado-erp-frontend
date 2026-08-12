import { z } from 'zod';

export const reviewManagementPlanSchema = z
  .object({
    decision: z.enum(['approved', 'rejected']),
    rejectionReason: z.string().optional(),
  })
  .refine((data) => data.decision !== 'rejected' || !!data.rejectionReason?.trim(), {
    message: 'Motivo da rejeição é obrigatório',
    path: ['rejectionReason'],
  });

export type ReviewManagementPlanFormData = z.infer<typeof reviewManagementPlanSchema>;
