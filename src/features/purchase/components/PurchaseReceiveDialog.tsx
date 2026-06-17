'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackageCheck, CheckCircle2 } from 'lucide-react';
import type { Purchase } from '../types';
import { receivePurchaseSchema, type ReceivePurchaseFormData } from '../schemas';
import { useReceivePurchaseItems } from '../hooks/useReceivePurchaseItems';
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

type PurchaseReceiveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: Purchase | null;
  onSuccess?: () => void;
};

export function PurchaseReceiveDialog({
  open,
  onOpenChange,
  purchase,
  onSuccess,
}: Readonly<PurchaseReceiveDialogProps>) {
  const receiveMutation = useReceivePurchaseItems();

  const defaultItems = () =>
    (purchase?.items ?? []).map((item) => ({
      purchase_item_id: item.id,
      received_quantity: 0,
    }));

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<ReceivePurchaseFormData>({
    resolver: zodResolver(receivePurchaseSchema),
    defaultValues: { items: defaultItems() },
  });

  useEffect(() => {
    if (open) reset({ items: defaultItems() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, purchase]);

  const watchedItems = useWatch({ control, name: 'items' });

  const items = purchase?.items ?? [];

  function getPending(idx: number) {
    const item = items[idx];
    if (!item) return 0;
    return Math.max(0, item.quantity - item.receivedQuantity);
  }

  function handleFillPending() {
    items.forEach((_, idx) => {
      setValue(`items.${idx}.received_quantity`, getPending(idx));
    });
  }

  function handleZero() {
    items.forEach((_, idx) => {
      setValue(`items.${idx}.received_quantity`, 0);
    });
  }

  const totalComprado = items.reduce((s, i) => s + i.quantity, 0);
  const totalJaRecebido = items.reduce((s, i) => s + i.receivedQuantity, 0);
  const totalInformando = (watchedItems ?? []).reduce(
    (s, i) => s + (Number(i?.received_quantity) || 0),
    0,
  );
  const progressPercent =
    totalComprado > 0
      ? Math.min(100, Math.round(((totalJaRecebido + totalInformando) / totalComprado) * 100))
      : 0;

  const hasAnyQuantity = totalInformando > 0;

  function onSubmit(data: ReceivePurchaseFormData) {
    if (!purchase) return;
    receiveMutation.mutate(
      { id: purchase.id, items: data.items.filter((i) => i.received_quantity > 0) },
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-900">
                Receber Compra {purchase?.referenceCode}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-0.5">
                Informe a quantidade efetivamente recebida para cada item.{' '}
                <span className="font-medium text-slate-700">
                  Fornecedor: {purchase?.supplierName}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Quick actions */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFillPending}
              className="text-teal-700 border-teal-200 hover:bg-teal-50"
            >
              Receber pendente
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleZero}
              className="text-slate-600"
            >
              Zerar
            </Button>
          </div>

          {/* Items table */}
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs tracking-wide">
                  <th className="px-4 py-2.5 text-left font-medium">Item</th>
                  <th className="px-4 py-2.5 text-center font-medium">Comprado</th>
                  <th className="px-4 py-2.5 text-center font-medium">Já recebido</th>
                  <th className="px-4 py-2.5 text-center font-medium">Pendente</th>
                  <th className="px-4 py-2.5 text-center font-medium">Recebendo agora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => {
                  const pending = getPending(idx);
                  const receivingNow = Number(watchedItems?.[idx]?.received_quantity) || 0;
                  const isValid = receivingNow > 0 && receivingNow <= pending;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{item.supplyName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.supplyId.slice(0, 8).toUpperCase()}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-700">
                        {item.quantity} <span className="text-slate-400 text-xs">{item.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-700">
                        {item.receivedQuantity}{' '}
                        <span className="text-slate-400 text-xs">{item.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={
                            pending > 0 ? 'font-semibold text-amber-600' : 'text-slate-400'
                          }
                        >
                          {pending} <span className="font-normal text-xs">{item.unit}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={pending}
                            step="any"
                            {...register(`items.${idx}.received_quantity`, {
                              valueAsNumber: true,
                            })}
                            disabled={pending === 0}
                            className="w-20 rounded-md border border-slate-300 px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-slate-100 disabled:text-slate-400"
                          />
                          {isValid && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {errors.items?.root && (
            <p className="text-sm text-red-500">{errors.items.root.message}</p>
          )}

          {/* Progress */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Progresso após este recebimento
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-medium">
                {totalJaRecebido + totalInformando} / {totalComprado}
              </span>
              <span className="text-teal-700 font-semibold">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={receiveMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!hasAnyQuantity || receiveMutation.isPending}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {receiveMutation.isPending ? 'Confirmando...' : 'Confirmar recebimento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
