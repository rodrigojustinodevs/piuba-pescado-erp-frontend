'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, DollarSign, TrendingDown, Wallet } from 'lucide-react';
import type { Purchase } from '../types';
import { registerPaymentSchema, type RegisterPaymentFormData } from '../schemas';
import { PAYMENT_METHOD_LABELS } from '../types';
import { useRegisterPurchasePayment } from '../hooks/useRegisterPurchasePayment';
import { usePurchasePayments } from '../hooks/usePurchasePayments';
import { formatPurchaseMoney } from '../utils/formatPurchaseMoney';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Progress } from '@/shared/components/ui/Progress';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Separator } from '@/shared/components/ui/Separator';

type PurchasePaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: Purchase | null;
  onSuccess?: () => void;
};

const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS) as [
  keyof typeof PAYMENT_METHOD_LABELS,
  string,
][];

function formatPaymentDate(dateStr: string): string {
  if (!dateStr) return '—';
  return formatNullableDatePtBR(dateStr, true);
}

export function PurchasePaymentDialog({
  open,
  onOpenChange,
  purchase,
  onSuccess,
}: Readonly<PurchasePaymentDialogProps>) {
  const registerPayment = useRegisterPurchasePayment();
  const { data: paymentsData, isLoading: isLoadingPayments } = usePurchasePayments(
    open ? purchase?.id : null,
  );

  const summary = paymentsData?.summary;
  const payments = paymentsData?.payments ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<RegisterPaymentFormData>({
    resolver: zodResolver(registerPaymentSchema),
    defaultValues: {
      payment_date: '',
      amount: undefined,
      payment_method: '',
      reference: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        payment_date: '',
        amount: undefined,
        payment_method: '',
        reference: '',
        notes: '',
      });
    }
  }, [open, reset]);

  if (!purchase) return null;

  const totalPrice = summary?.totalAmount ?? purchase.totalPrice ?? 0;
  const paidAmount = summary?.totalPaid ?? purchase.paidAmount ?? 0;
  const pendingAmount = summary?.balance ?? Math.max(0, totalPrice - paidAmount);
  const progressPercent = summary ? Math.min(100, Math.round(summary.progress)) : (totalPrice > 0 ? Math.min(100, Math.round((paidAmount / totalPrice) * 100)) : 0);

  function renderPaymentHistory() {
    if (isLoadingPayments) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }
    if (!payments || payments.length === 0) {
      return <p className="text-sm text-slate-400 py-3 text-center">Nenhum pagamento registrado.</p>;
    }
    return (
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500">
              <th className="px-3 py-2 text-left font-medium">Data</th>
              <th className="px-3 py-2 text-left font-medium">Método</th>
              <th className="px-3 py-2 text-left font-medium">Referência</th>
              <th className="px-3 py-2 text-right font-medium">Valor</th>
              <th className="px-3 py-2 text-left font-medium">Observação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50/50">
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                  {formatPaymentDate(payment.paymentDate)}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {PAYMENT_METHOD_LABELS[payment.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS] ?? payment.paymentMethod}
                </td>
                <td className="px-3 py-2 text-slate-500">{payment.reference ?? '—'}</td>
                <td className="px-3 py-2 text-right font-medium text-emerald-700 whitespace-nowrap">
                  {formatPurchaseMoney(payment.amount)}
                </td>
                <td className="px-3 py-2 text-slate-500 max-w-[140px] truncate">
                  {payment.notes ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function onSubmit(data: RegisterPaymentFormData) {
    if (!purchase) return;
    registerPayment.mutate(
      {
        id: purchase.id,
        data: {
          payment_date: data.payment_date,
          amount: data.amount,
          payment_method: data.payment_method,
          reference: data.reference || undefined,
          notes: data.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-900">
                Registrar Pagamento
                <span className="ml-2 text-base font-normal text-slate-500">
                  {purchase.referenceCode}
                </span>
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-0.5">
                Fornecedor:{' '}
                <span className="font-medium text-slate-700">{purchase.supplierName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Financial summary */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-slate-200">
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500">Valor total</span>
                </div>
                <p className="text-base font-bold text-slate-900">{formatPurchaseMoney(totalPrice)}</p>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 bg-emerald-50/40">
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs text-emerald-700">Valor pago</span>
                </div>
                <p className="text-base font-bold text-emerald-700">{formatPurchaseMoney(paidAmount)}</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50/40">
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs text-amber-700">Saldo pendente</span>
                </div>
                <p className="text-base font-bold text-amber-700">{formatPurchaseMoney(pendingAmount)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Progresso do pagamento</span>
              <span className="font-semibold text-slate-700">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <Separator />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Payment date */}
            <div className="space-y-1.5">
              <label htmlFor="payment_date" className="text-sm font-medium text-slate-700">
                Data do pagamento <span className="text-red-500">*</span>
              </label>
              <input
                id="payment_date"
                type="datetime-local"
                {...register('payment_date')}
                className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.payment_date && (
                <p className="text-xs text-red-500">{errors.payment_date.message}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label htmlFor="amount" className="text-sm font-medium text-slate-700">
                Valor pago <span className="text-red-500">*</span>
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                {...register('amount', { valueAsNumber: true })}
                className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.amount && (
                <p className="text-xs text-red-500">{errors.amount.message}</p>
              )}
            </div>
          </div>

          {/* Payment method */}
          <div className="space-y-1.5">
            <label htmlFor="payment_method" className="text-sm font-medium text-slate-700">
              Método de pagamento <span className="text-red-500">*</span>
            </label>
            <select
              id="payment_method"
              {...register('payment_method')}
              className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Selecione o método</option>
              {PAYMENT_METHOD_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.payment_method && (
              <p className="text-xs text-red-500">{errors.payment_method.message}</p>
            )}
          </div>

          {/* Reference */}
          <div className="space-y-1.5">
            <label htmlFor="reference" className="text-sm font-medium text-slate-700">Referência</label>
            <input
              id="reference"
              type="text"
              placeholder="Ex: PIX-845632"
              {...register('reference')}
              className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-sm font-medium text-slate-700">Observações</label>
            <textarea
              id="notes"
              rows={2}
              placeholder="Observações sobre o pagamento..."
              {...register('notes')}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Payment history */}
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">Histórico de pagamentos</p>
            {renderPaymentHistory()}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={registerPayment.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || registerPayment.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {registerPayment.isPending ? 'Registrando...' : 'Registrar pagamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
