'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { Control, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useCompanies } from '@/features/company';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { FormActions, Select, TextArea } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';
import { addRequiredCompanyIssue } from '@/shared/utils/zod';
import { PAYMENT_METHOD_LABELS, type CreatePurchaseData } from '../types';
import { createPurchaseFormSchema, type CreatePurchaseFormData } from '../schemas';
import { usePurchaseLookupOptions } from '../hooks/usePurchaseLookupOptions';
import { getPurchaseStatusLabel } from '../utils/purchaseStatusLabels';
import { formatPurchaseMoney } from '../utils/formatPurchaseMoney';
import { Separator } from '@/src/shared/components/ui/Separator';
import { Button } from '@/src/shared/components/ui/Button';

const STATUS_OPTIONS = [
  { value: 'draft', label: getPurchaseStatusLabel('draft') },
  { value: 'submitted', label: getPurchaseStatusLabel('submitted') },
  { value: 'approved', label: getPurchaseStatusLabel('approved') },
  { value: 'partially_received', label: getPurchaseStatusLabel('partially_received') },
  { value: 'received', label: getPurchaseStatusLabel('received') },
  { value: 'cancelled', label: getPurchaseStatusLabel('cancelled') },
];

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

function generateReferenceCode(): string {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `PC-${year}-${rand}`;
}

type PurchaseFormProps = {
  initialValues?: CreatePurchaseFormData;
  onSubmit: (data: CreatePurchaseData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  statusOptions?: Array<CreatePurchaseFormData['status']>;
  inDialog?: boolean;
};

// ─── Subcomponentes de cálculo ──────────────────────────────────────────────

function ItemTotal({ control, index }: Readonly<{ control: Control<CreatePurchaseFormData>; index: number }>) {
  const qty = useWatch({ control, name: `items.${index}.quantity` });
  const price = useWatch({ control, name: `items.${index}.unitPrice` });
  const discount = useWatch({ control, name: `items.${index}.discount` });
  const total = roundMoney((Number(qty) || 0) * (Number(price) || 0) - (Number(discount) || 0));
  return (
    <div className="pt-6 text-right">
      <p className="text-xs text-slate-500">Total</p>
      <p className="text-sm font-semibold text-[#0F172A] tabular-nums">
        {formatPurchaseMoney(Math.max(0, total))}
      </p>
    </div>
  );
}

function FinancialSummary({ control }: Readonly<{ control: Control<CreatePurchaseFormData> }>) {
  const items = useWatch({ control, name: 'items' });
  const freightCost = useWatch({ control, name: 'freightCost' });
  const otherCosts = useWatch({ control, name: 'otherCosts' });

  const subtotal = (items ?? []).reduce((sum: number, item: CreatePurchaseFormData['items'][number]) => {
    const t = roundMoney(
      (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0) - (Number(item.discount) || 0),
    );
    return sum + Math.max(0, t);
  }, 0);

  const extras = (Number(freightCost) || 0) + (Number(otherCosts) || 0);
  const total = roundMoney(subtotal + extras);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 min-w-50 w-52 shrink-0 self-start sticky top-0">
      <p className="text-sm font-semibold text-slate-700">Resumo</p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatPurchaseMoney(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Frete + Outros</span>
          <span className="tabular-nums">{formatPurchaseMoney(extras)}</span>
        </div>
      </div>
      <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-[#0EA5A4]">
        <span>Total</span>
        <span className="tabular-nums">{formatPurchaseMoney(total)}</span>
      </div>
    </div>
  );
}

export function PurchaseForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
  statusOptions,
  inDialog = false,
}: Readonly<PurchaseFormProps>) {
  const { user, isMaster } = useAuthContext();
  const showCompanySelect = isMaster();

  const resolverSchema = useMemo(
    () =>
      createPurchaseFormSchema.superRefine((data, ctx) => {
        if (showCompanySelect && !data.companyId?.trim()) {
          addRequiredCompanyIssue(ctx);
        }
      }),
    [showCompanySelect],
  );

  const availableStatusOptions = useMemo(() => {
    const allowed = new Set(statusOptions ?? STATUS_OPTIONS.map((o) => o.value));
    return STATUS_OPTIONS.filter((o) => allowed.has(o.value));
  }, [statusOptions]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatePurchaseFormData>({
    resolver: zodResolver(resolverSchema) as Resolver<CreatePurchaseFormData>,
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      companyId: '',
      referenceCode: generateReferenceCode(),
      supplierId: '',
      supplierDocument: '',
      responsibleName: '',
      invoiceNumber: '',
      orderDate: todayISODate(),
      expectedDeliveryDate: '',
      status: 'draft',
      paymentMethod: 'boleto',
      items: [{ supplyId: '', quantity: 1, unit: 'kg', unitPrice: 0, discount: 0 }],
      freightCost: 0,
      otherCosts: 0,
      notes: '',
    },
  });

  const { data: companiesData, isLoading: loadingCompanies } = useCompanies({
    page: 1,
    limit: 500,
    enabled: showCompanySelect,
  });
  const companyOptions = useMemo(
    () => (companiesData?.companies ?? []).map((c) => ({ value: c.id, label: c.name })),
    [companiesData?.companies],
  );

  const { effectiveCompanyId, suppliersData, suppliesData, loadingSuppliers, loadingSupplies } =
    usePurchaseLookupOptions({
      control,
      showCompanySelect,
      companyIdFieldName: 'companyId',
    });

  const supplierSelectOptions = useMemo(
    () => (suppliersData?.suppliers ?? []).map((s) => ({ value: s.id, label: s.name })),
    [suppliersData?.suppliers],
  );
  const supplySelectOptions = useMemo(
    () =>
      (suppliesData?.supplies ?? []).map((s) => ({
        value: s.id,
        label: s.sku ? `${s.name} (${s.sku})` : s.name,
      })),
    [suppliesData?.supplies],
  );

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const paymentMethodOptions = useMemo(
    () => Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({ value, label })),
    [],
  );

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const prevCompanyForReset = useRef<string | undefined>(undefined);
  useEffect(() => {
    const id = effectiveCompanyId || undefined;
    if (!id) return;
    if (prevCompanyForReset.current !== undefined && prevCompanyForReset.current !== id) {
      setValue('supplierId', '');
      setValue('supplierDocument', '');
      setValue('items', [{ supplyId: '', quantity: 1, unit: 'kg', unitPrice: 0, discount: 0 }]);
    }
    prevCompanyForReset.current = id;
  }, [effectiveCompanyId, setValue]);

  if (!user) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-700">
        Carregando sessão...
      </div>
    );
  }

  if (!showCompanySelect && !user.companyId) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-900">
        Não foi possível identificar a empresa do usuário. Faça login novamente ou contate o
        suporte.
      </div>
    );
  }

  const submit = (form: CreatePurchaseFormData) => {
    const companyId = showCompanySelect ? form.companyId?.trim() : user.companyId;
    if (!companyId) return;
    const inv = form.invoiceNumber?.trim();
    onSubmit({
      companyId,
      supplierId: form.supplierId,
      invoiceNumber: inv ? inv : null,
      orderDate: form.orderDate,
      status: form.status,
      paymentStatus: 'pending',
      items: form.items.map((it) => ({
        supplyId: it.supplyId,
        quantity: it.quantity,
        unit: it.unit.trim(),
        unitPrice: it.unitPrice,
        discount: it.discount ?? 0,
        totalPrice: roundMoney(Math.max(0, it.quantity * it.unitPrice - (it.discount ?? 0))),
      })),
      referenceCode: form.referenceCode,
      responsibleName: form.responsibleName?.trim() || undefined,
      paymentMethod: form.paymentMethod || undefined,
      expectedDeliveryDate: form.expectedDeliveryDate || null,
      freightCost: form.freightCost ?? 0,
      otherCosts: form.otherCosts ?? 0,
      notes: form.notes?.trim() || undefined,
    });
  };
  console.log('render form', { defaultValues: initialValues });
  const innerContent = (
    <div className="space-y-6">
      {showCompanySelect && (
        <Controller
          control={control}
          name="companyId"
          render={({ field }) => (
            <Select
              label="Empresa"
              required
              disabled={isSubmitting || loadingCompanies}
              options={companyOptions}
              placeholder={loadingCompanies ? 'Carregando empresas...' : 'Selecione a empresa'}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={errors.companyId?.message}
            />
          )}
        />
      )}

      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Código"
            disabled={isSubmitting}
            {...register('referenceCode')}
            error={errors.referenceCode?.message}
          />
          <div className="md:col-span-2">
            <Controller
              control={control}
              name="supplierId"
              render={({ field }) => (
                <Select
                  label="Fornecedor"
                  required
                  disabled={isSubmitting || loadingSuppliers}
                  options={supplierSelectOptions}
                  placeholder={loadingSuppliers ? 'Carregando...' : 'Selecione o fornecedor'}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  error={errors.supplierId?.message}
                />
              )}
            />
          </div>
          <Input
            label="CNPJ / Documento"
            disabled={isSubmitting}
            {...register('supplierDocument')}
            error={errors.supplierDocument?.message}
          />
          <Input
            label="Responsável"
            requiredIndicator
            disabled={isSubmitting}
            {...register('responsibleName')}
            error={errors.responsibleName?.message}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                label="Status"
                disabled={isSubmitting}
                options={availableStatusOptions}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.status?.message}
              />
            )}
          />
          <Input
            label="Data do pedido"
            type="date"
            disabled={isSubmitting}
            {...register('orderDate')}
            error={errors.orderDate?.message}
          />
          <Input
            label="Previsão de entrega"
            type="date"
            disabled={isSubmitting}
            {...register('expectedDeliveryDate')}
            error={errors.expectedDeliveryDate?.message}
          />
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <Select
                label="Forma de pagamento"
                disabled={isSubmitting}
                options={paymentMethodOptions}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.paymentMethod?.message}
              />
            )}
          />
          <Input
            label="Número da nota fiscal"
            disabled={isSubmitting}
            {...register('invoiceNumber')}
            error={errors.invoiceNumber?.message}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Itens do pedido</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ supplyId: '', quantity: 1, unit: 'kg', unitPrice: 0, discount: 0 })
              }
            >
              <Plus className="h-4 w-4" /> Adicionar item
            </Button>
          </div>
          <div className="space-y-2">
            {fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 rounded-md border p-3">
                <div className="col-span-12 md:col-span-5">
                  <Controller
                    control={control}
                    name={`items.${idx}.supplyId`}
                    render={({ field: f }) => (
                      <Select
                        label={`Item #${idx + 1}`}
                        disabled={isSubmitting || loadingSupplies}
                        options={supplySelectOptions}
                        placeholder={loadingSupplies ? 'Carregando...' : 'Selecione o insumo'}
                        value={f.value ?? ''}
                        onChange={f.onChange}
                        onBlur={f.onBlur}
                        name={f.name}
                        error={errors.items?.[idx]?.supplyId?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Input
                    label="Qtd"
                    type="number"
                    min={0}
                    step="0.01"
                    disabled={isSubmitting}
                    {...register(`items.${idx}.quantity`, { valueAsNumber: true })}
                    error={errors.items?.[idx]?.quantity?.message}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Input
                    label="Preço unit."
                    type="number"
                    min={0}
                    step="0.01"
                    disabled={isSubmitting}
                    {...register(`items.${idx}.unitPrice`, { valueAsNumber: true })}
                    error={errors.items?.[idx]?.unitPrice?.message}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Input
                    label="Desconto"
                    type="number"
                    min={0}
                    step="0.01"
                    disabled={isSubmitting}
                    {...register(`items.${idx}.discount`, { valueAsNumber: true })}
                    error={errors.items?.[idx]?.discount?.message}
                  />
                </div>
                <div className="col-span-12 md:col-span-1 flex items-end justify-between md:justify-end gap-2 pb-1">
                  <ItemTotal control={control} index={idx} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(idx)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex gap-4 items-start">
          <div className="grid gap-4 md:grid-cols-2 flex-1">
            <Input
              label="Frete"
              type="number"
              min={0}
              step="0.01"
              disabled={isSubmitting}
              {...register('freightCost', { valueAsNumber: true })}
              error={errors.freightCost?.message}
            />
            <Input
              label="Outros custos"
              type="number"
              min={0}
              step="0.01"
              disabled={isSubmitting}
              {...register('otherCosts', { valueAsNumber: true })}
              error={errors.otherCosts?.message}
            />
          </div>
          <FinancialSummary control={control} />
        </div>

        <TextArea
          label="Observações"
          rows={2}
          disabled={isSubmitting}
          placeholder="Condições especiais, local de entrega, etc."
          {...register('notes')}
          error={errors.notes?.message}
        />
      </div>

      <FormActions
        submitLabel={submitLabel}
        loadingLabel={submittingLabel}
        isLoading={isSubmitting}
        onCancel={onCancel}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit(submit)}>
      {inDialog ? (
        innerContent
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {innerContent}
        </div>
      )}
    </form>
  );
}
