'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewManagementPlanSchema, type ReviewManagementPlanFormData } from '../schemas';
import { useReviewManagementPlan } from '../hooks/useReviewManagementPlan';
import { useAlertModal } from '@/shared/components/AlertModal';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { TextArea } from '@/shared/components/form';

type ReviewManagementPlanModalProps = {
  planId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ReviewManagementPlanModal({
  planId,
  open,
  onOpenChange,
}: Readonly<ReviewManagementPlanModalProps>) {
  const reviewManagementPlan = useReviewManagementPlan();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewManagementPlanFormData>({
    resolver: zodResolver(reviewManagementPlanSchema),
    defaultValues: { decision: 'rejected', rejectionReason: '' },
  });

  const onSubmit = (data: ReviewManagementPlanFormData) => {
    reviewManagementPlan.mutate(
      { id: planId, decision: 'rejected', rejectionReason: data.rejectionReason },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejeitar plano de manejo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextArea
            label="Motivo da rejeição"
            required
            placeholder="Descreva o motivo da rejeição"
            disabled={reviewManagementPlan.isPending}
            {...register('rejectionReason')}
            error={errors.rejectionReason?.message}
          />
          <DialogFooter>
            <button
              type="button"
              disabled={reviewManagementPlan.isPending}
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={reviewManagementPlan.isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {reviewManagementPlan.isPending ? 'Rejeitando...' : 'Confirmar rejeição'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function useApproveManagementPlan(planId: string) {
  const reviewManagementPlan = useReviewManagementPlan();
  const { showSuccess: showConfirm } = useAlertModal();

  return {
    isPending: reviewManagementPlan.isPending,
    approve: () => {
      showConfirm(
        'Aprovar plano de manejo',
        'Tem certeza que deseja aprovar este plano de manejo?',
        'Sim, Aprovar',
        () => reviewManagementPlan.mutate({ id: planId, decision: 'approved' }),
      );
    },
  };
}
